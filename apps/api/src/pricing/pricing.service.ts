import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  setPrice(skuId: string, amount: number) {
    return this.prisma.price.create({ data: { skuId, amount } });
  }

  async quote(skuId: string, quantity: number) {
    const sku = await this.prisma.sku.findUnique({ where: { id: skuId } });
    if (!sku) return { amount: 0 };
    // Simplified: amount = pricePerCanonicalUnit * quantity
    return { amount: Math.round(sku.pricePerCanonicalUnit * quantity) };
  }
}


