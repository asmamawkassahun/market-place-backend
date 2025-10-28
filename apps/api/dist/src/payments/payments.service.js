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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const loyalty_service_1 = require("../loyalty/loyalty.service");
let PaymentsService = class PaymentsService {
    prisma;
    loyalty;
    constructor(prisma, loyalty) {
        this.prisma = prisma;
        this.loyalty = loyalty;
    }
    async initiate(paymentId, provider) {
        return this.prisma.payment.update({
            where: { id: paymentId },
            data: { provider, status: provider === 'cod' ? 'INITIATED' : 'AUTHORIZED' },
        });
    }
    async capture(paymentId) {
        const payment = await this.prisma.payment.update({ where: { id: paymentId }, data: { status: 'CAPTURED' } });
        const escrow = await this.prisma.escrow.update({ where: { paymentId }, data: { status: 'RELEASED', released: payment.amount } });
        const order = await this.prisma.order.findUnique({ where: { id: payment.orderId } });
        if (order)
            await this.loyalty.awardForOrder(order.userId, order.id, payment.amount);
        return { payment, escrow };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, loyalty_service_1.LoyaltyService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map