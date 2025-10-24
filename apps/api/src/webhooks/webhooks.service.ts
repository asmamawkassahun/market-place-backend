import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async accept(provider: 'telebirr'|'chapa'|'amole', payload: any) {
    // Idempotency via external ID
    const extId = payload?.id || payload?.txRef || payload?.transactionId;
    const existing = extId ? await this.prisma.paymentProviderTx.findFirst({ where: { extId } }) : null;
    if (existing) return { ok: true };
    const paymentId = payload?.meta?.paymentId || payload?.paymentId;
    if (paymentId) {
      await this.prisma.paymentProviderTx.create({ data: { paymentId, extId, payload } as any });
      // Update payment status per provider mapping (mock)
      await this.prisma.payment.update({ where: { id: paymentId }, data: { status: 'AUTHORIZED' as any } });
    }
    return { ok: true };
  }
}


