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
exports.StockNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let StockNotificationsService = class StockNotificationsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(userId, data) {
        const existing = await this.prisma.stockNotification.findFirst({
            where: {
                userId,
                productId: data.productId,
                skuId: data.skuId || null,
                isActive: true,
            },
        });
        if (existing) {
            return existing;
        }
        return this.prisma.stockNotification.create({
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
        return this.prisma.stockNotification.findMany({
            where: { userId },
            include: {
                product: true,
                sku: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const notification = await this.prisma.stockNotification.findUnique({
            where: { id },
            include: {
                product: true,
                sku: true,
            },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Stock notification not found');
        }
        if (notification.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return notification;
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.stockNotification.delete({ where: { id } });
    }
    async checkStockAndNotify(skuId) {
        const notifications = await this.prisma.stockNotification.findMany({
            where: {
                skuId,
                isActive: true,
                notifiedAt: null,
            },
            include: {
                user: true,
                product: true,
                sku: true,
            },
        });
        const inventoryLots = await this.prisma.inventoryLot.findMany({
            where: { skuId },
        });
        const totalStock = inventoryLots.reduce((sum, lot) => sum + lot.quantity, 0);
        if (totalStock > 0) {
            for (const notification of notifications) {
                await this.sendStockNotification(notification);
                await this.prisma.stockNotification.update({
                    where: { id: notification.id },
                    data: { notifiedAt: new Date() },
                });
            }
        }
        return notifications.length;
    }
    async checkProductStockAndNotify(productId) {
        const skus = await this.prisma.sku.findMany({
            where: { productId, active: true },
        });
        let totalNotifications = 0;
        for (const sku of skus) {
            const notifications = await this.checkStockAndNotify(sku.id);
            totalNotifications += notifications;
        }
        return totalNotifications;
    }
    async sendStockNotification(notification) {
        const productName = notification.product?.name || 'Product';
        const skuName = notification.sku?.name ? ` (${notification.sku.name})` : '';
        const message = `Back in Stock: ${productName}${skuName} is now available!`;
        if (notification.user.email) {
            await this.notificationsService.email(notification.user.email, 'Product Back in Stock', `<h2>Back in Stock</h2><p>${message}</p>`);
        }
        if (notification.user.phone) {
            await this.notificationsService.sms(notification.user.phone, message);
        }
    }
};
exports.StockNotificationsService = StockNotificationsService;
exports.StockNotificationsService = StockNotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], StockNotificationsService);
//# sourceMappingURL=stock-notifications.service.js.map