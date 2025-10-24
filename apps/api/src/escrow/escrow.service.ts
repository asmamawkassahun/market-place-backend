import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EscrowService {
  constructor(private prisma: PrismaService) {}

  async getByPaymentId(paymentId: string) {
    const escrow = await this.prisma.escrow.findUnique({ where: { paymentId } });
    if (!escrow) throw new NotFoundException('Escrow not found');
    return escrow;
  }

  async dispute(paymentId: string, reason: string) {
    const escrow = await this.prisma.escrow.findUnique({ where: { paymentId } });
    if (!escrow) throw new NotFoundException('Escrow not found');
    return this.prisma.paymentProviderTx.create({ data: { paymentId, payload: { type: 'DISPUTE', reason } } as any });
  }

  async release(paymentId: string, amount?: number) {
    const escrow = await this.prisma.escrow.findUnique({ where: { paymentId } });
    if (!escrow) throw new NotFoundException('Escrow not found');
    const toRelease = amount ?? escrow.holdAmount;
    if (toRelease < 0 || toRelease > escrow.holdAmount) throw new BadRequestException('Invalid amount');
    const released = Math.min(escrow.released + toRelease, escrow.holdAmount);
    const status = released >= escrow.holdAmount ? 'RELEASED' : 'PARTIALLY_RELEASED';
    return this.prisma.escrow.update({ where: { paymentId }, data: { released, status: status as any } });
  }

  async refund(paymentId: string, amount?: number) {
    const escrow = await this.prisma.escrow.findUnique({ where: { paymentId } });
    if (!escrow) throw new NotFoundException('Escrow not found');
    const toRefund = amount ?? (escrow.holdAmount - escrow.released);
    if (toRefund < 0) throw new BadRequestException('Invalid amount');
    return this.prisma.escrow.update({ where: { paymentId }, data: { status: 'REFUNDED' as any } });
  }
}


