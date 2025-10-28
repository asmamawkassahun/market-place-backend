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
exports.EscrowService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EscrowService = class EscrowService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getByPaymentId(paymentId) {
        const escrow = await this.prisma.escrow.findUnique({ where: { paymentId } });
        if (!escrow)
            throw new common_1.NotFoundException('Escrow not found');
        return escrow;
    }
    async dispute(paymentId, reason) {
        const escrow = await this.prisma.escrow.findUnique({ where: { paymentId } });
        if (!escrow)
            throw new common_1.NotFoundException('Escrow not found');
        return this.prisma.paymentProviderTx.create({ data: { paymentId, payload: { type: 'DISPUTE', reason } } });
    }
    async release(paymentId, amount) {
        const escrow = await this.prisma.escrow.findUnique({ where: { paymentId } });
        if (!escrow)
            throw new common_1.NotFoundException('Escrow not found');
        const toRelease = amount ?? escrow.holdAmount;
        if (toRelease < 0 || toRelease > escrow.holdAmount)
            throw new common_1.BadRequestException('Invalid amount');
        const released = Math.min(escrow.released + toRelease, escrow.holdAmount);
        const status = released >= escrow.holdAmount ? 'RELEASED' : 'PARTIALLY_RELEASED';
        return this.prisma.escrow.update({ where: { paymentId }, data: { released, status: status } });
    }
    async refund(paymentId, amount) {
        const escrow = await this.prisma.escrow.findUnique({ where: { paymentId } });
        if (!escrow)
            throw new common_1.NotFoundException('Escrow not found');
        const toRefund = amount ?? (escrow.holdAmount - escrow.released);
        if (toRefund < 0)
            throw new common_1.BadRequestException('Invalid amount');
        return this.prisma.escrow.update({ where: { paymentId }, data: { status: 'REFUNDED' } });
    }
};
exports.EscrowService = EscrowService;
exports.EscrowService = EscrowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EscrowService);
//# sourceMappingURL=escrow.service.js.map