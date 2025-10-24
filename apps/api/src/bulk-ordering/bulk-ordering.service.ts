import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBulkOrderDto } from './dto/create-bulk-order.dto';
import { BulkOrderQuoteRequestDto } from './dto/bulk-order-quote-request.dto';
import { CreateGroupBuyDto } from './dto/create-group-buy.dto';
import { JoinGroupBuyDto } from './dto/join-group-buy.dto';

@Injectable()
export class BulkOrderingService {
  constructor(private prisma: PrismaService) {}

  async createBulkOrder(userId: string, data: CreateBulkOrderDto) {
    // Verify merchant exists
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: data.merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    // Calculate total amount
    let totalAmount = 0;
    const items = [];

    for (const item of data.items) {
      let sku;
      if (item.skuId) {
        sku = await this.prisma.sku.findUnique({
          where: { id: item.skuId },
          include: {
            product: true,
          },
        });
      } else {
        // Get the cheapest SKU for the product
        const skus = await this.prisma.sku.findMany({
          where: {
            productId: item.productId,
            active: true,
          },
          orderBy: { pricePerCanonicalUnit: 'asc' },
          take: 1,
        });
        sku = skus[0];
      }

      if (!sku) {
        throw new NotFoundException(`SKU not found for product ${item.productId}`);
      }

      const unitPrice = this.calculateBulkPrice(sku.pricePerCanonicalUnit, item.quantity);
      const totalPrice = unitPrice * item.quantity;

      items.push({
        productId: item.productId,
        skuId: sku.id,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        notes: item.notes,
      });

      totalAmount += totalPrice;
    }

    return this.prisma.bulkOrder.create({
      data: {
        userId,
        merchantId: data.merchantId,
        totalAmount,
        notes: data.notes,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: {
            product: true,
            sku: true,
          },
        },
        merchant: true,
      },
    });
  }

  async getBulkOrderQuote(data: BulkOrderQuoteRequestDto) {
    // Verify merchant exists
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: data.merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    let totalAmount = 0;
    const items = [];

    for (const item of data.items) {
      let sku;
      if (item.skuId) {
        sku = await this.prisma.sku.findUnique({
          where: { id: item.skuId },
          include: {
            product: true,
          },
        });
      } else {
        const skus = await this.prisma.sku.findMany({
          where: {
            productId: item.productId,
            active: true,
          },
          include: {
            product: true,
          },
          orderBy: { pricePerCanonicalUnit: 'asc' },
          take: 1,
        });
        sku = skus[0];
      }

      if (!sku) {
        throw new NotFoundException(`SKU not found for product ${item.productId}`);
      }

      const unitPrice = this.calculateBulkPrice(sku.pricePerCanonicalUnit, item.quantity);
      const totalPrice = unitPrice * item.quantity;

      items.push({
        productId: item.productId,
        skuId: sku.id,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        product: sku.product,
        sku: sku,
      });

      totalAmount += totalPrice;
    }

    return {
      merchantId: data.merchantId,
      totalAmount,
      currency: 'ETB',
      items,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };
  }

  async findAllBulkOrders(userId: string) {
    return this.prisma.bulkOrder.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            sku: true,
          },
        },
        merchant: true,
        quotes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneBulkOrder(id: string, userId: string) {
    const order = await this.prisma.bulkOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            sku: true,
          },
        },
        merchant: true,
        quotes: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Bulk order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async createGroupBuy(merchantId: string, data: CreateGroupBuyDto) {
    // Verify merchant exists
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    // Verify product/SKU exists
    if (data.skuId) {
      const sku = await this.prisma.sku.findUnique({
        where: { id: data.skuId },
      });
      if (!sku) {
        throw new NotFoundException('SKU not found');
      }
    } else {
      const product = await this.prisma.product.findUnique({
        where: { id: data.productId },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
    }

    return this.prisma.groupBuy.create({
      data: {
        merchantId,
        productId: data.productId,
        skuId: data.skuId,
        name: data.name,
        description: data.description,
        targetQuantity: data.targetQuantity,
        pricePerUnit: data.pricePerUnit,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
      },
      include: {
        product: true,
        sku: true,
        merchant: true,
        participants: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllGroupBuys() {
    return this.prisma.groupBuy.findMany({
      where: {
        status: 'active',
        startsAt: { lte: new Date() },
        endsAt: { gte: new Date() },
      },
      include: {
        product: true,
        sku: true,
        merchant: true,
        participants: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneGroupBuy(id: string) {
    const groupBuy = await this.prisma.groupBuy.findUnique({
      where: { id },
      include: {
        product: true,
        sku: true,
        merchant: true,
        participants: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!groupBuy) {
      throw new NotFoundException('Group buy not found');
    }

    return groupBuy;
  }

  async joinGroupBuy(groupBuyId: string, userId: string, data: JoinGroupBuyDto) {
    const groupBuy = await this.prisma.groupBuy.findUnique({
      where: { id: groupBuyId },
    });

    if (!groupBuy) {
      throw new NotFoundException('Group buy not found');
    }

    if (groupBuy.status !== 'active') {
      throw new BadRequestException('Group buy is not active');
    }

    if (groupBuy.startsAt > new Date()) {
      throw new BadRequestException('Group buy has not started yet');
    }

    if (groupBuy.endsAt < new Date()) {
      throw new BadRequestException('Group buy has ended');
    }

    // Check if user already joined
    const existingParticipation = await this.prisma.groupBuyParticipant.findFirst({
      where: {
        groupBuyId,
        userId,
      },
    });

    if (existingParticipation) {
      throw new BadRequestException('You have already joined this group buy');
    }

    // Create participation
    const participant = await this.prisma.groupBuyParticipant.create({
      data: {
        groupBuyId,
        userId,
        quantity: data.quantity,
      },
    });

    // Update group buy current quantity
    const newCurrentQuantity = groupBuy.currentQuantity + data.quantity;
    await this.prisma.groupBuy.update({
      where: { id: groupBuyId },
      data: { currentQuantity: newCurrentQuantity },
    });

    // Check if target reached
    if (newCurrentQuantity >= groupBuy.targetQuantity) {
      await this.prisma.groupBuy.update({
        where: { id: groupBuyId },
        data: { status: 'completed' },
      });
    }

    return participant;
  }

  private calculateBulkPrice(basePrice: number, quantity: number): number {
    // Apply quantity-based discounts
    let discount = 0;
    
    if (quantity >= 1000) {
      discount = 0.20; // 20% discount for 1000+ units
    } else if (quantity >= 500) {
      discount = 0.15; // 15% discount for 500+ units
    } else if (quantity >= 100) {
      discount = 0.10; // 10% discount for 100+ units
    } else if (quantity >= 50) {
      discount = 0.05; // 5% discount for 50+ units
    }

    return Math.round(basePrice * (1 - discount));
  }
}
