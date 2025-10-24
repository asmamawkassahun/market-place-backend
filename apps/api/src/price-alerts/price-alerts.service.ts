import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePriceAlertDto } from './dto/create-price-alert.dto';
import { UpdatePriceAlertDto } from './dto/update-price-alert.dto';

@Injectable()
export class PriceAlertsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, data: CreatePriceAlertDto) {
    // Validate that either productId or skuId is provided
    if (!data.productId && !data.skuId) {
      throw new Error('Either productId or skuId must be provided');
    }

    return this.prisma.priceAlert.create({
      data: {
        ...data,
        userId,
      },
      include: {
        product: true,
        sku: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.priceAlert.findMany({
      where: { userId },
      include: {
        product: true,
        sku: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const alert = await this.prisma.priceAlert.findUnique({
      where: { id },
      include: {
        product: true,
        sku: true,
      },
    });

    if (!alert) {
      throw new NotFoundException('Price alert not found');
    }

    if (alert.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return alert;
  }

  async update(id: string, userId: string, data: UpdatePriceAlertDto) {
    await this.findOne(id, userId);
    
    return this.prisma.priceAlert.update({
      where: { id },
      data,
      include: {
        product: true,
        sku: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.priceAlert.delete({ where: { id } });
  }

  async checkPriceAlerts() {
    const activeAlerts = await this.prisma.priceAlert.findMany({
      where: {
        isActive: true,
        triggeredAt: null,
      },
      include: {
        product: true,
        sku: true,
        user: true,
      },
    });

    const triggeredAlerts = [];

    for (const alert of activeAlerts) {
      let currentPrice: number;

      if (alert.skuId) {
        // Check SKU price
        const sku = await this.prisma.sku.findUnique({
          where: { id: alert.skuId },
        });
        currentPrice = sku?.pricePerCanonicalUnit || 0;
      } else if (alert.productId) {
        // Check product's lowest SKU price
        const skus = await this.prisma.sku.findMany({
          where: {
            productId: alert.productId,
            active: true,
          },
          orderBy: { pricePerCanonicalUnit: 'asc' },
          take: 1,
        });
        currentPrice = skus[0]?.pricePerCanonicalUnit || 0;
      } else {
        continue;
      }

      if (currentPrice <= alert.targetPrice) {
        // Trigger alert
        await this.prisma.priceAlert.update({
          where: { id: alert.id },
          data: { triggeredAt: new Date() },
        });

        // Send notification
        await this.sendPriceAlertNotification(alert, currentPrice);
        triggeredAlerts.push(alert);
      }
    }

    return triggeredAlerts;
  }

  private async sendPriceAlertNotification(alert: any, currentPrice: number) {
    const productName = alert.product?.name || 'Product';
    const price = (currentPrice / 100).toFixed(2);
    const targetPrice = (alert.targetPrice / 100).toFixed(2);

    const message = `Price Alert: ${productName} is now ${price} ETB (target: ${targetPrice} ETB)`;

    // Send email notification
    if (alert.user.email) {
      await this.notificationsService.email(
        alert.user.email,
        'Price Alert Triggered',
        `<h2>Price Alert</h2><p>${message}</p>`,
      );
    }

    // Send SMS notification
    if (alert.user.phone) {
      await this.notificationsService.sms(alert.user.phone, message);
    }
  }
}
