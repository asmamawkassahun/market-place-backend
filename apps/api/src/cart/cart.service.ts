import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({ where: { userId } });
    if (!cart) cart = await this.prisma.cart.create({ data: { userId } });
    return cart;
  }

  async addItem(userId: string, item: { skuId: string; quantity: number }) {
    const cart = await this.getOrCreateCart(userId);
    const sku = await this.prisma.sku.findUnique({ where: { id: item.skuId } });
    if (!sku) throw new BadRequestException('SKU not found');
    return this.prisma.cartItem.create({ data: { cartId: cart.id, skuId: item.skuId, quantity: item.quantity, unitPrice: sku.pricePerCanonicalUnit } });
  }

  async list(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return this.prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { sku: true } } } });
  }

  async removeItem(userId: string, cartItemId: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!item || item.cartId !== cart.id) throw new BadRequestException('Item not in cart');
    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async updateItem(userId: string, cartItemId: string, data: { quantity: number }) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!item || item.cartId !== cart.id) throw new BadRequestException('Item not in cart');
    
    if (data.quantity <= 0) {
      return this.removeItem(userId, cartItemId);
    }
    
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: data.quantity }
    });
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  async getCartCount(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    const count = await this.prisma.cartItem.aggregate({
      where: { cartId: cart.id },
      _sum: { quantity: true }
    });
    return { count: count._sum.quantity || 0 };
  }
}


