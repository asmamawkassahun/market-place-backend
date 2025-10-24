import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';

type Provider = 'telebirr'|'chapa'|'amole'|'cod';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private loyalty: LoyaltyService) {}

  async initiate(paymentId: string, provider: Provider) {
    // Stub providers: mark as AUTHORIZED immediately except COD stays INITIATED
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { provider, status: provider === 'cod' ? 'INITIATED' : 'AUTHORIZED' },
    });
  }

  async capture(paymentId: string) {
    // Capture and release escrow fully for MVP
    const payment = await this.prisma.payment.update({ where: { id: paymentId }, data: { status: 'CAPTURED' } });
    const escrow = await this.prisma.escrow.update({ where: { paymentId }, data: { status: 'RELEASED', released: payment.amount } });
    const order = await this.prisma.order.findUnique({ where: { id: payment.orderId } });
    if (order) await this.loyalty.awardForOrder(order.userId, order.id, payment.amount);
    return { payment, escrow };
  }
}


