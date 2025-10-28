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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addLot(merchantId, data) {
        const sku = await this.prisma.sku.findUnique({ where: { id: data.skuId }, include: { product: true } });
        if (!sku)
            throw new common_1.NotFoundException('SKU not found');
        if (sku.product.merchantId !== merchantId)
            throw new common_1.NotFoundException('SKU not owned by merchant');
        const lot = await this.prisma.inventoryLot.create({
            data: {
                merchantId,
                skuId: data.skuId,
                quantity: data.quantity,
                expiry: data.expiry ? new Date(data.expiry) : undefined
            }
        });
        await this.recordMovement(merchantId, {
            skuId: data.skuId,
            type: 'addition',
            quantity: data.quantity,
            reason: 'New inventory lot added',
        });
        return lot;
    }
    async listForMerchant(merchantId) {
        return this.prisma.inventoryLot.findMany({ where: { merchantId }, include: { sku: true } });
    }
    async recordMovement(merchantId, data, createdBy) {
        const sku = await this.prisma.sku.findUnique({
            where: { id: data.skuId },
            include: { product: true }
        });
        if (!sku)
            throw new common_1.NotFoundException('SKU not found');
        if (sku.product.merchantId !== merchantId)
            throw new common_1.NotFoundException('SKU not owned by merchant');
        const movement = await this.prisma.inventoryMovement.create({
            data: {
                merchantId,
                skuId: data.skuId,
                type: data.type,
                quantity: data.quantity,
                reason: data.reason,
                referenceId: data.referenceId,
                createdBy,
            },
        });
        if (data.type === 'removal' || data.type === 'adjustment' || data.type === 'sale') {
            await this.updateInventoryLot(merchantId, data.skuId, data.quantity);
        }
        return movement;
    }
    async getMovements(merchantId, skuId, limit = 50) {
        const whereClause = { merchantId };
        if (skuId) {
            whereClause.skuId = skuId;
        }
        return this.prisma.inventoryMovement.findMany({
            where: whereClause,
            include: {
                sku: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getInventoryAnalytics(merchantId) {
        const inventoryLots = await this.prisma.inventoryLot.findMany({
            where: { merchantId },
            include: {
                sku: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        const totalValue = inventoryLots.reduce((sum, lot) => {
            return sum + (lot.quantity * lot.sku.pricePerCanonicalUnit);
        }, 0);
        const lowStockItems = inventoryLots.filter(lot => lot.quantity < 10);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentMovements = await this.prisma.inventoryMovement.findMany({
            where: {
                merchantId,
                createdAt: { gte: thirtyDaysAgo },
            },
        });
        const movementsByType = recentMovements.reduce((acc, movement) => {
            acc[movement.type] = (acc[movement.type] || 0) + 1;
            return acc;
        }, {});
        return {
            totalValue: totalValue / 100,
            totalItems: inventoryLots.length,
            lowStockItems: lowStockItems.length,
            lowStockAlerts: lowStockItems.map(lot => ({
                skuId: lot.skuId,
                skuName: lot.sku.name,
                currentQuantity: lot.quantity,
                productName: lot.sku.product.name,
            })),
            recentMovements: movementsByType,
            totalMovements: recentMovements.length,
        };
    }
    async getLowStockAlerts(merchantId, threshold = 10) {
        const lowStockLots = await this.prisma.inventoryLot.findMany({
            where: {
                merchantId,
                quantity: { lt: threshold },
            },
            include: {
                sku: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return lowStockLots.map(lot => ({
            skuId: lot.skuId,
            skuName: lot.sku.name,
            productName: lot.sku.product.name,
            currentQuantity: lot.quantity,
            threshold,
            unitType: lot.sku.unitType,
        }));
    }
    async updateInventoryLot(merchantId, skuId, quantityChange) {
        const lot = await this.prisma.inventoryLot.findFirst({
            where: {
                merchantId,
                skuId,
                quantity: { gt: 0 },
            },
            orderBy: { createdAt: 'asc' },
        });
        if (!lot) {
            throw new common_1.BadRequestException('Insufficient inventory');
        }
        const newQuantity = lot.quantity + quantityChange;
        if (newQuantity < 0) {
            throw new common_1.BadRequestException('Insufficient inventory');
        }
        if (newQuantity === 0) {
            await this.prisma.inventoryLot.delete({ where: { id: lot.id } });
        }
        else {
            await this.prisma.inventoryLot.update({
                where: { id: lot.id },
                data: { quantity: newQuantity },
            });
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map