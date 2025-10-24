import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function invoiceNumber() { return 'INV-' + Math.random().toString(36).slice(2, 8).toUpperCase(); }

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async generate(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return null;
    const vatAmount = Math.round(order.totalAmount * 0.15);
    return this.prisma.invoice.create({ data: { orderId, number: invoiceNumber(), totalAmount: order.totalAmount, vatAmount } });
  }

  get(orderId: string) { return this.prisma.invoice.findUnique({ where: { orderId } }); }
}


