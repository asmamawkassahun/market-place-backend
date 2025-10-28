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
exports.PriceAlertsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let PriceAlertsService = class PriceAlertsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(userId, data) {
        if (!data.productId && !data.skuId) {
            throw new Error('Either productId or skuId must be provided');
        }
        return this.prisma.priceAlert.create({
            data: {
                ...data,
                userId,
            },
            include: {
                product: true,
                sku: true,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.priceAlert.findMany({
            where: { userId },
            include: {
                product: true,
                sku: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const alert = await this.prisma.priceAlert.findUnique({
            where: { id },
            include: {
                product: true,
                sku: true,
            },
        });
        if (!alert) {
            throw new common_1.NotFoundException('Price alert not found');
        }
        if (alert.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return alert;
    }
    async update(id, userId, data) {
        await this.findOne(id, userId);
        return this.prisma.priceAlert.update({
            where: { id },
            data,
            include: {
                product: true,
                sku: true,
            },
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.priceAlert.delete({ where: { id } });
    }
    async checkPriceAlerts() {
        const activeAlerts = await this.prisma.priceAlert.findMany({
            where: {
                isActive: true,
                triggeredAt: null,
            },
            include: {
                product: true,
                sku: true,
                user: true,
            },
        });
        const triggeredAlerts = [];
        for (const alert of activeAlerts) {
            let currentPrice;
            if (alert.skuId) {
                const sku = await this.prisma.sku.findUnique({
                    where: { id: alert.skuId },
                });
                currentPrice = sku?.pricePerCanonicalUnit || 0;
            }
            else if (alert.productId) {
                const skus = await this.prisma.sku.findMany({
                    where: {
                        productId: alert.productId,
                        active: true,
                    },
                    orderBy: { pricePerCanonicalUnit: 'asc' },
                    take: 1,
                });
                currentPrice = skus[0]?.pricePerCanonicalUnit || 0;
            }
            else {
                continue;
            }
            if (currentPrice <= alert.targetPrice) {
                await this.prisma.priceAlert.update({
                    where: { id: alert.id },
                    data: { triggeredAt: new Date() },
                });
                await this.sendPriceAlertNotification(alert, currentPrice);
                triggeredAlerts.push(alert);
            }
        }
        return triggeredAlerts;
    }
    async sendPriceAlertNotification(alert, currentPrice) {
        const productName = alert.product?.name || 'Product';
        const price = (currentPrice / 100).toFixed(2);
        const targetPrice = (alert.targetPrice / 100).toFixed(2);
        const message = `Price Alert: ${productName} is now ${price} ETB (target: ${targetPrice} ETB)`;
        if (alert.user.email) {
            await this.notificationsService.email(alert.user.email, 'Price Alert Triggered', `<h2>Price Alert</h2><p>${message}</p>`);
        }
        if (alert.user.phone) {
            await this.notificationsService.sms(alert.user.phone, message);
        }
    }
};
exports.PriceAlertsService = PriceAlertsService;
exports.PriceAlertsService = PriceAlertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PriceAlertsService);
//# sourceMappingURL=price-alerts.service.js.map