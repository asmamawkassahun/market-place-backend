import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getMerchantByOwnerId(ownerId: string) {
    return this.prisma.merchant.findUnique({
      where: { ownerId },
      select: { id: true }
    });
  }

  async createFromCart(userId: string, addressId: string, paymentProvider: string) {
    const cart = await this.prisma.cart.findFirst({ where: { userId }, include: { items: { include: { sku: { include: { product: true } } } } } });
    if (!cart || cart.items.length === 0) throw new BadRequestException('Cart is empty');
    // For MVP, use first item's merchant; production would split per-merchant
    const merchantId = cart.items[0].sku.product.merchantId;
    const totalAmount = cart.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({ data: { userId, merchantId, addressId, totalAmount } });
      for (const it of cart.items) {
        await tx.orderItem.create({ data: { orderId: order.id, skuId: it.skuId, requestedQty: it.quantity, unitPrice: it.unitPrice } });
      }
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      const payment = await tx.payment.create({ data: { orderId: order.id, provider: paymentProvider, amount: totalAmount } });
      await tx.escrow.create({ data: { paymentId: payment.id, holdAmount: totalAmount } });
      return { orderId: order.id, paymentId: payment.id };
    });
  }

  list(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, include: { items: true, payments: true, shipments: true } });
  }

  // New methods for the updated controller
  async getOrders(userId: string, params: any) {
    const { page, limit, status, merchantId, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) where.status = status;
    if (merchantId) where.merchantId = merchantId;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          items: {
            include: {
              sku: {
                include: {
                  product: {
                    select: { name: true, images: true }
                  }
                }
              }
            }
          },
          payments: true,
          shipments: true,
          merchant: {
            select: { id: true, displayName: true }
          },
          address: {
            select: { fullName: true, line1: true, city: true }
          }
        }
      }),
      this.prisma.order.count({ where })
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getOrder(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            sku: {
              include: {
                product: {
                  select: { name: true, images: true }
                }
              }
            }
          }
        },
        payments: true,
        shipments: {
          include: {
            events: true
          }
        },
        merchant: {
          select: { id: true, displayName: true, rating: true }
        },
        address: true
      }
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return order;
  }

  async createOrder(userId: string, data: any) {
    // This would create an order directly without going through cart
    // For now, just throw an error as this is not implemented
    throw new BadRequestException('Direct order creation not implemented. Use createFromCart instead.');
  }

  async updateOrder(userId: string, id: string, data: any) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId }
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data
    });
  }

  async cancelOrder(userId: string, id: string, reason?: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId }
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Order is already cancelled');
    }

    if (order.status === 'DELIVERED') {
      throw new BadRequestException('Cannot cancel delivered order');
    }

    return this.prisma.order.update({
      where: { id },
      data: { 
        status: 'CANCELLED',
        updatedAt: new Date()
      }
    });
  }

  async updateOrderStatus(userId: string, id: string, status: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId }
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: { 
        status: status as any,
        updatedAt: new Date()
      }
    });
  }

  async getOrderItems(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId }
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return this.prisma.orderItem.findMany({
      where: { orderId },
      include: {
        sku: {
          include: {
            product: {
              select: { name: true, images: true }
            }
          }
        }
      }
    });
  }

  async getOrderTracking(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId }
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const shipments = await this.prisma.shipment.findMany({
      where: { orderId },
      include: {
        events: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return {
      orderId,
      status: order.status,
      shipments
    };
  }

  async getOrderInvoice(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        invoice: true,
        items: {
          include: {
            sku: {
              include: {
                product: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (!order.invoice) {
      throw new BadRequestException('Invoice not found for this order');
    }

    // In a real implementation, you would generate a PDF here
    // For now, return the invoice data
    return {
      invoice: order.invoice,
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        currency: order.currency,
        createdAt: order.createdAt
      },
      items: order.items
    };
  }

  async getMerchantOrders(merchantId: string, params: any) {
    const { page, limit, status, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const where: any = { merchantId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, phone: true, name: true }
          },
          items: {
            include: {
              sku: {
                include: {
                  product: {
                    select: { name: true, images: true }
                  }
                }
              }
            }
          },
          payments: true,
          shipments: true,
          address: {
            select: { fullName: true, line1: true, city: true }
          }
        }
      }),
      this.prisma.order.count({ where })
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}


