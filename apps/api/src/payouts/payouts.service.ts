import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayoutsService {
  constructor(private prisma: PrismaService) {}

  async request(ownerId: string, amount: number) {
    const m = await this.prisma.merchant.findUnique({ where: { ownerId } });
    if (!m) throw new NotFoundException('Merchant not found');
    return this.prisma.payout.create({ data: { merchantId: m.id, amount } });
  }

  listForMerchant(ownerId: string) {
    return this.prisma.merchant.findUnique({ where: { ownerId }, include: { payouts: true } });
  }
}


