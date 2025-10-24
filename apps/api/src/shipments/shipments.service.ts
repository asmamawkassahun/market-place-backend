import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ManualCarrier } from './carriers/manual.carrier';
import { NotificationsService } from '../notifications/notifications.service';

function genOtp() { return Math.floor(100000 + Math.random() * 900000).toString(); }

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService, private manual: ManualCarrier, private notify: NotificationsService) {}

  async create(orderId: string, carrier = 'manual') {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    const otp = genOtp();
    const created = await this.manual.createShipment(orderId);
    const shipment = await this.prisma.shipment.create({ data: { orderId, carrier, otp, trackingCode: created.trackingCode } });
    // Best-effort SMS to order phone
    const fullOrder = await this.prisma.order.findUnique({ where: { id: orderId }, include: { user: true, address: true } });
    if (fullOrder?.address?.phone) {
      await this.notify.sms(fullOrder.address.phone, `Your order ${orderId} is on the way. OTP: ${otp}`);
    }
    return shipment;
  }

  async confirmDelivery(shipmentId: string, otp: string) {
    const shipment = await this.prisma.shipment.findUnique({ where: { id: shipmentId }, include: { order: true } });
    if (!shipment) throw new NotFoundException('Shipment not found');
    if (!shipment.otp || shipment.otp !== otp) throw new BadRequestException('Invalid OTP');
    await this.prisma.shipment.update({ where: { id: shipmentId }, data: { status: 'DELIVERED' as any } });
    await this.prisma.order.update({ where: { id: shipment.orderId }, data: { status: 'DELIVERED' as any } });
    // In a full flow we would capture payment here via PaymentsService
    const fullOrder = await this.prisma.order.findUnique({ where: { id: shipment.orderId }, include: { address: true } });
    if (fullOrder?.address?.phone) {
      await this.notify.sms(fullOrder.address.phone, `Order ${shipment.orderId} delivered. Thank you!`);
    }
    return { ok: true };
  }
}


