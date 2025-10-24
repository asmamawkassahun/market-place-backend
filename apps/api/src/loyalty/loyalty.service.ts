import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async awardForOrder(userId: string, orderId: string, amountCents: number) {
    const points = Math.floor(amountCents / 100); // 1 point per ETB for MVP
    if (points <= 0) return null;
    return this.prisma.loyaltyTransaction.create({ data: { userId, points, reason: `Order ${orderId}` } });
  }
}


