import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateStockNotificationDto } from './dto/create-stock-notification.dto';

@Injectable()
export class StockNotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, data: CreateStockNotificationDto) {
    // Check if subscription already exists
    const existing = await this.prisma.stockNotification.findFirst({
      where: {
        userId,
        productId: data.productId,
        skuId: data.skuId || null,
        isActive: true,
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.stockNotification.create({
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
    return this.prisma.stockNotification.findMany({
      where: { userId },
      include: {
        product: true,
        sku: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const notification = await this.prisma.stockNotification.findUnique({
      where: { id },
      include: {
        product: true,
        sku: true,
      },
    });

    if (!notification) {
      throw new NotFoundException('Stock notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return notification;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.stockNotification.delete({ where: { id } });
  }

  async checkStockAndNotify(skuId: string) {
    // Get all active notifications for this SKU
    const notifications = await this.prisma.stockNotification.findMany({
      where: {
        skuId,
        isActive: true,
        notifiedAt: null,
      },
      include: {
        user: true,
        product: true,
        sku: true,
      },
    });

    // Check current stock level
    const inventoryLots = await this.prisma.inventoryLot.findMany({
      where: { skuId },
    });

    const totalStock = inventoryLots.reduce((sum, lot) => sum + lot.quantity, 0);

    if (totalStock > 0) {
      // Stock is available, notify users
      for (const notification of notifications) {
        await this.sendStockNotification(notification);
        
        // Mark as notified
        await this.prisma.stockNotification.update({
          where: { id: notification.id },
          data: { notifiedAt: new Date() },
        });
      }
    }

    return notifications.length;
  }

  async checkProductStockAndNotify(productId: string) {
    // Get all SKUs for this product
    const skus = await this.prisma.sku.findMany({
      where: { productId, active: true },
    });

    let totalNotifications = 0;

    for (const sku of skus) {
      const notifications = await this.checkStockAndNotify(sku.id);
      totalNotifications += notifications;
    }

    return totalNotifications;
  }

  private async sendStockNotification(notification: any) {
    const productName = notification.product?.name || 'Product';
    const skuName = notification.sku?.name ? ` (${notification.sku.name})` : '';

    const message = `Back in Stock: ${productName}${skuName} is now available!`;

    // Send email notification
    if (notification.user.email) {
      await this.notificationsService.email(
        notification.user.email,
        'Product Back in Stock',
        `<h2>Back in Stock</h2><p>${message}</p>`,
      );
    }

    // Send SMS notification
    if (notification.user.phone) {
      await this.notificationsService.sms(notification.user.phone, message);
    }
  }
}
