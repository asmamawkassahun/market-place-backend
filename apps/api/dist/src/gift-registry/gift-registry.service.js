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
exports.GiftRegistryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let GiftRegistryService = class GiftRegistryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const shareToken = data.isPublic ? this.generateShareToken() : null;
        return this.prisma.giftRegistry.create({
            data: {
                ...data,
                userId,
                shareToken,
                eventDate: data.eventDate ? new Date(data.eventDate) : null,
            },
            include: {
                items: {
                    include: {
                        product: true,
                        sku: true,
                    },
                },
            },
        });
    }
    async findAll(userId) {
        return this.prisma.giftRegistry.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                        sku: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const registry = await this.prisma.giftRegistry.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                        sku: true,
                    },
                },
            },
        });
        if (!registry) {
            throw new common_1.NotFoundException('Gift registry not found');
        }
        if (registry.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return registry;
    }
    async findByShareToken(shareToken) {
        const registry = await this.prisma.giftRegistry.findUnique({
            where: { shareToken },
            include: {
                items: {
                    include: {
                        product: true,
                        sku: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!registry) {
            throw new common_1.NotFoundException('Gift registry not found');
        }
        return registry;
    }
    async update(id, userId, data) {
        const registry = await this.findOne(id, userId);
        const updateData = { ...data };
        if (data.eventDate) {
            updateData.eventDate = new Date(data.eventDate);
        }
        if (data.isPublic && !registry.shareToken) {
            updateData.shareToken = this.generateShareToken();
        }
        else if (data.isPublic === false) {
            updateData.shareToken = null;
        }
        return this.prisma.giftRegistry.update({
            where: { id },
            data: updateData,
            include: {
                items: {
                    include: {
                        product: true,
                        sku: true,
                    },
                },
            },
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.giftRegistry.delete({ where: { id } });
    }
    async addItem(registryId, userId, data) {
        const registry = await this.findOne(registryId, userId);
        const existingItem = await this.prisma.giftRegistryItem.findFirst({
            where: {
                registryId,
                productId: data.productId,
                skuId: data.skuId || null,
            },
        });
        if (existingItem) {
            return this.prisma.giftRegistryItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: data.quantity,
                    notes: data.notes || existingItem.notes,
                    priority: data.priority || existingItem.priority,
                },
                include: {
                    product: true,
                    sku: true,
                },
            });
        }
        return this.prisma.giftRegistryItem.create({
            data: {
                registryId,
                ...data,
                priority: data.priority || 'medium',
            },
            include: {
                product: true,
                sku: true,
            },
        });
    }
    async markPurchased(registryId, itemId, data) {
        const registry = await this.prisma.giftRegistry.findUnique({
            where: { id: registryId },
        });
        if (!registry) {
            throw new common_1.NotFoundException('Gift registry not found');
        }
        const item = await this.prisma.giftRegistryItem.findFirst({
            where: {
                id: itemId,
                registryId,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Gift registry item not found');
        }
        const quantityPurchased = data.quantityPurchased || item.quantity;
        const newQuantityPurchased = item.quantityPurchased + quantityPurchased;
        const isFullyPurchased = newQuantityPurchased >= item.quantity;
        return this.prisma.giftRegistryItem.update({
            where: { id: itemId },
            data: {
                quantityPurchased: newQuantityPurchased,
                isPurchased: isFullyPurchased,
                purchasedBy: data.purchasedBy,
                purchasedAt: isFullyPurchased ? new Date() : null,
            },
            include: {
                product: true,
                sku: true,
            },
        });
    }
    async removeItem(registryId, itemId, userId) {
        const registry = await this.findOne(registryId, userId);
        const item = await this.prisma.giftRegistryItem.findFirst({
            where: {
                id: itemId,
                registryId,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Gift registry item not found');
        }
        return this.prisma.giftRegistryItem.delete({ where: { id: itemId } });
    }
    generateShareToken() {
        return (0, crypto_1.randomBytes)(16).toString('hex');
    }
};
exports.GiftRegistryService = GiftRegistryService;
exports.GiftRegistryService = GiftRegistryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GiftRegistryService);
//# sourceMappingURL=gift-registry.service.js.map