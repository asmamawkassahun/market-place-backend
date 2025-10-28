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
exports.BulkOrderingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BulkOrderingService = class BulkOrderingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBulkOrder(userId, data) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: data.merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        let totalAmount = 0;
        const items = [];
        for (const item of data.items) {
            let sku;
            if (item.skuId) {
                sku = await this.prisma.sku.findUnique({
                    where: { id: item.skuId },
                    include: {
                        product: true,
                    },
                });
            }
            else {
                const skus = await this.prisma.sku.findMany({
                    where: {
                        productId: item.productId,
                        active: true,
                    },
                    orderBy: { pricePerCanonicalUnit: 'asc' },
                    take: 1,
                });
                sku = skus[0];
            }
            if (!sku) {
                throw new common_1.NotFoundException(`SKU not found for product ${item.productId}`);
            }
            const unitPrice = this.calculateBulkPrice(sku.pricePerCanonicalUnit, item.quantity);
            const totalPrice = unitPrice * item.quantity;
            items.push({
                productId: item.productId,
                skuId: sku.id,
                quantity: item.quantity,
                unitPrice,
                totalPrice,
                notes: item.notes,
            });
            totalAmount += totalPrice;
        }
        return this.prisma.bulkOrder.create({
            data: {
                userId,
                merchantId: data.merchantId,
                totalAmount,
                notes: data.notes,
                items: {
                    create: items,
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                        sku: true,
                    },
                },
                merchant: true,
            },
        });
    }
    async getBulkOrderQuote(data) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: data.merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        let totalAmount = 0;
        const items = [];
        for (const item of data.items) {
            let sku;
            if (item.skuId) {
                sku = await this.prisma.sku.findUnique({
                    where: { id: item.skuId },
                    include: {
                        product: true,
                    },
                });
            }
            else {
                const skus = await this.prisma.sku.findMany({
                    where: {
                        productId: item.productId,
                        active: true,
                    },
                    include: {
                        product: true,
                    },
                    orderBy: { pricePerCanonicalUnit: 'asc' },
                    take: 1,
                });
                sku = skus[0];
            }
            if (!sku) {
                throw new common_1.NotFoundException(`SKU not found for product ${item.productId}`);
            }
            const unitPrice = this.calculateBulkPrice(sku.pricePerCanonicalUnit, item.quantity);
            const totalPrice = unitPrice * item.quantity;
            items.push({
                productId: item.productId,
                skuId: sku.id,
                quantity: item.quantity,
                unitPrice,
                totalPrice,
                product: sku.product,
                sku: sku,
            });
            totalAmount += totalPrice;
        }
        return {
            merchantId: data.merchantId,
            totalAmount,
            currency: 'ETB',
            items,
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };
    }
    async findAllBulkOrders(userId) {
        return this.prisma.bulkOrder.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                        sku: true,
                    },
                },
                merchant: true,
                quotes: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneBulkOrder(id, userId) {
        const order = await this.prisma.bulkOrder.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                        sku: true,
                    },
                },
                merchant: true,
                quotes: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Bulk order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return order;
    }
    async createGroupBuy(merchantId, data) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        if (data.skuId) {
            const sku = await this.prisma.sku.findUnique({
                where: { id: data.skuId },
            });
            if (!sku) {
                throw new common_1.NotFoundException('SKU not found');
            }
        }
        else {
            const product = await this.prisma.product.findUnique({
                where: { id: data.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
        }
        return this.prisma.groupBuy.create({
            data: {
                merchantId,
                productId: data.productId,
                skuId: data.skuId,
                name: data.name,
                description: data.description,
                targetQuantity: data.targetQuantity,
                pricePerUnit: data.pricePerUnit,
                startsAt: new Date(data.startsAt),
                endsAt: new Date(data.endsAt),
            },
            include: {
                product: true,
                sku: true,
                merchant: true,
                participants: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async findAllGroupBuys() {
        return this.prisma.groupBuy.findMany({
            where: {
                status: 'active',
                startsAt: { lte: new Date() },
                endsAt: { gte: new Date() },
            },
            include: {
                product: true,
                sku: true,
                merchant: true,
                participants: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneGroupBuy(id) {
        const groupBuy = await this.prisma.groupBuy.findUnique({
            where: { id },
            include: {
                product: true,
                sku: true,
                merchant: true,
                participants: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
        if (!groupBuy) {
            throw new common_1.NotFoundException('Group buy not found');
        }
        return groupBuy;
    }
    async joinGroupBuy(groupBuyId, userId, data) {
        const groupBuy = await this.prisma.groupBuy.findUnique({
            where: { id: groupBuyId },
        });
        if (!groupBuy) {
            throw new common_1.NotFoundException('Group buy not found');
        }
        if (groupBuy.status !== 'active') {
            throw new common_1.BadRequestException('Group buy is not active');
        }
        if (groupBuy.startsAt > new Date()) {
            throw new common_1.BadRequestException('Group buy has not started yet');
        }
        if (groupBuy.endsAt < new Date()) {
            throw new common_1.BadRequestException('Group buy has ended');
        }
        const existingParticipation = await this.prisma.groupBuyParticipant.findFirst({
            where: {
                groupBuyId,
                userId,
            },
        });
        if (existingParticipation) {
            throw new common_1.BadRequestException('You have already joined this group buy');
        }
        const participant = await this.prisma.groupBuyParticipant.create({
            data: {
                groupBuyId,
                userId,
                quantity: data.quantity,
            },
        });
        const newCurrentQuantity = groupBuy.currentQuantity + data.quantity;
        await this.prisma.groupBuy.update({
            where: { id: groupBuyId },
            data: { currentQuantity: newCurrentQuantity },
        });
        if (newCurrentQuantity >= groupBuy.targetQuantity) {
            await this.prisma.groupBuy.update({
                where: { id: groupBuyId },
                data: { status: 'completed' },
            });
        }
        return participant;
    }
    calculateBulkPrice(basePrice, quantity) {
        let discount = 0;
        if (quantity >= 1000) {
            discount = 0.20;
        }
        else if (quantity >= 500) {
            discount = 0.15;
        }
        else if (quantity >= 100) {
            discount = 0.10;
        }
        else if (quantity >= 50) {
            discount = 0.05;
        }
        return Math.round(basePrice * (1 - discount));
    }
};
exports.BulkOrderingService = BulkOrderingService;
exports.BulkOrderingService = BulkOrderingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BulkOrderingService);
//# sourceMappingURL=bulk-ordering.service.js.map