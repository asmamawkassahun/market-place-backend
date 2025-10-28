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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let WishlistService = class WishlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const shareToken = data.isPublic ? this.generateShareToken() : null;
        return this.prisma.wishlist.create({
            data: {
                ...data,
                userId,
                shareToken,
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
        return this.prisma.wishlist.findMany({
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
        const wishlist = await this.prisma.wishlist.findUnique({
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
        if (!wishlist) {
            throw new common_1.NotFoundException('Wishlist not found');
        }
        if (wishlist.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return wishlist;
    }
    async findByShareToken(shareToken) {
        const wishlist = await this.prisma.wishlist.findUnique({
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
        if (!wishlist) {
            throw new common_1.NotFoundException('Wishlist not found');
        }
        return wishlist;
    }
    async update(id, userId, data) {
        const wishlist = await this.findOne(id, userId);
        const updateData = { ...data };
        if (data.isPublic && !wishlist.shareToken) {
            updateData.shareToken = this.generateShareToken();
        }
        else if (!data.isPublic) {
            updateData.shareToken = null;
        }
        return this.prisma.wishlist.update({
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
        return this.prisma.wishlist.delete({ where: { id } });
    }
    async addItem(wishlistId, userId, data) {
        const wishlist = await this.findOne(wishlistId, userId);
        const existingItem = await this.prisma.wishlistItem.findFirst({
            where: {
                wishlistId,
                productId: data.productId,
                skuId: data.skuId || null,
            },
        });
        if (existingItem) {
            return this.prisma.wishlistItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: data.quantity || existingItem.quantity + 1,
                    notes: data.notes || existingItem.notes,
                },
                include: {
                    product: true,
                    sku: true,
                },
            });
        }
        return this.prisma.wishlistItem.create({
            data: {
                wishlistId,
                ...data,
                quantity: data.quantity || 1,
            },
            include: {
                product: true,
                sku: true,
            },
        });
    }
    async removeItem(wishlistId, itemId, userId) {
        const wishlist = await this.findOne(wishlistId, userId);
        const item = await this.prisma.wishlistItem.findFirst({
            where: {
                id: itemId,
                wishlistId,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Wishlist item not found');
        }
        return this.prisma.wishlistItem.delete({ where: { id: itemId } });
    }
    generateShareToken() {
        return (0, crypto_1.randomBytes)(16).toString('hex');
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map