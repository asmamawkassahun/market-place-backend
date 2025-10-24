import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KycService {
  constructor(private prisma: PrismaService) {}

  async submit(ownerId: string, data: { documentUrl: string }) {
    const merchant = await this.prisma.merchant.findUnique({ where: { ownerId } });
    if (!merchant) throw new NotFoundException('Merchant not found');
    return this.prisma.merchantKyc.upsert({
      where: { merchantId: merchant.id },
      update: { documentUrl: data.documentUrl },
      create: { merchantId: merchant.id, documentUrl: data.documentUrl },
    });
  }

  async review(merchantId: string, status: 'PENDING'|'APPROVED'|'REJECTED', notes?: string) {
    return this.prisma.merchantKyc.update({ where: { merchantId }, data: { status, notes } });
  }

  get(merchantId: string) { return this.prisma.merchantKyc.findUnique({ where: { merchantId } }); }
}


