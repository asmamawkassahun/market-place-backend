"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const manual_carrier_1 = require("./carriers/manual.carrier");
const notifications_service_1 = require("../notifications/notifications.service");
function genOtp() { return Math.floor(100000 + Math.random() * 900000).toString(); }
let ShipmentsService = class ShipmentsService {
    prisma;
    manual;
    notify;
    constructor(prisma, manual, notify) {
        this.prisma = prisma;
        this.manual = manual;
        this.notify = notify;
    }
    async create(orderId, carrier = 'manual') {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const otp = genOtp();
        const created = await this.manual.createShipment(orderId);
        const shipment = await this.prisma.shipment.create({ data: { orderId, carrier, otp, trackingCode: created.trackingCode } });
        const fullOrder = await this.prisma.order.findUnique({ where: { id: orderId }, include: { user: true, address: true } });
        if (fullOrder?.address?.phone) {
            await this.notify.sms(fullOrder.address.phone, `Your order ${orderId} is on the way. OTP: ${otp}`);
        }
        return shipment;
    }
    async confirmDelivery(shipmentId, otp) {
        const shipment = await this.prisma.shipment.findUnique({ where: { id: shipmentId }, include: { order: true } });
        if (!shipment)
            throw new common_1.NotFoundException('Shipment not found');
        if (!shipment.otp || shipment.otp !== otp)
            throw new common_1.BadRequestException('Invalid OTP');
        await this.prisma.shipment.update({ where: { id: shipmentId }, data: { status: 'DELIVERED' } });
        await this.prisma.order.update({ where: { id: shipment.orderId }, data: { status: 'DELIVERED' } });
        const fullOrder = await this.prisma.order.findUnique({ where: { id: shipment.orderId }, include: { address: true } });
        if (fullOrder?.address?.phone) {
            await this.notify.sms(fullOrder.address.phone, `Order ${shipment.orderId} delivered. Thank you!`);
        }
        return { ok: true };
    }
};
exports.ShipmentsService = ShipmentsService;
exports.ShipmentsService = ShipmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, manual_carrier_1.ManualCarrier, notifications_service_1.NotificationsService])
], ShipmentsService);
//# sourceMappingURL=shipments.service.js.map