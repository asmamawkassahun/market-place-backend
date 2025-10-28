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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts(params) {
        const { page, limit, category, search, merchantId, isActive, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (category)
            where.categoryId = category;
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        if (merchantId)
            where.merchantId = merchantId;
        if (isActive !== undefined)
            where.isActive = isActive;
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    skus: true,
                    merchant: {
                        select: { id: true, displayName: true, rating: true }
                    },
                    category: {
                        select: { id: true, name: true }
                    }
                }
            }),
            this.prisma.product.count({ where })
        ]);
        return {
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async searchProducts(query, params) {
        return this.getProducts({ ...params, search: query });
    }
    async getProduct(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                skus: true,
                merchant: {
                    select: { id: true, displayName: true, rating: true }
                },
                category: {
                    select: { id: true, name: true }
                }
            }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async getProductSkus(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.prisma.sku.findMany({
            where: { productId },
            orderBy: { createdAt: 'asc' }
        });
    }
    async getProductReviews(productId, params) {
        const { page, limit } = params;
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { productId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, name: true, phone: true }
                    }
                }
            }),
            this.prisma.review.count({ where: { productId } })
        ]);
        return {
            reviews,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getProductQnA(productId, params) {
        const { page, limit } = params;
        const skip = (page - 1) * limit;
        const [qnas, total] = await Promise.all([
            this.prisma.qna.findMany({
                where: { productId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, name: true, phone: true }
                    }
                }
            }),
            this.prisma.qna.count({ where: { productId } })
        ]);
        return {
            qnas,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async createProduct(ownerUserId, data) {
        const merchant = await this.prisma.merchant.findUnique({ where: { ownerId: ownerUserId } });
        if (!merchant)
            throw new common_1.NotFoundException('Merchant not found for current user');
        const { skus, ...productData } = data;
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    merchantId: merchant.id,
                    ...productData,
                    images: productData.images || []
                }
            });
            if (skus && skus.length > 0) {
                await Promise.all(skus.map((sku) => tx.sku.create({
                    data: {
                        productId: product.id,
                        ...sku,
                        pricePerCanonicalUnit: Math.round(sku.pricePerCanonicalUnit * 100) || 0,
                    }
                })));
            }
            return tx.product.findUnique({
                where: { id: product.id },
                include: { skus: true }
            });
        });
    }
    async updateProduct(ownerUserId, productId, data) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { merchant: true }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.merchant.ownerId !== ownerUserId) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        return this.prisma.product.update({
            where: { id: productId },
            data
        });
    }
    async deleteProduct(ownerUserId, productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { merchant: true }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.merchant.ownerId !== ownerUserId) {
            throw new common_1.ForbiddenException('You can only delete your own products');
        }
        return this.prisma.product.delete({ where: { id: productId } });
    }
    async createProductSku(ownerUserId, productId, data) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { merchant: true }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.merchant.ownerId !== ownerUserId) {
            throw new common_1.ForbiddenException('You can only add SKUs to your own products');
        }
        return this.prisma.sku.create({ data: { productId, ...data } });
    }
    async updateProductSku(ownerUserId, productId, skuId, data) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { merchant: true }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.merchant.ownerId !== ownerUserId) {
            throw new common_1.ForbiddenException('You can only update SKUs of your own products');
        }
        const sku = await this.prisma.sku.findUnique({
            where: { id: skuId }
        });
        if (!sku || sku.productId !== productId) {
            throw new common_1.NotFoundException('SKU not found');
        }
        return this.prisma.sku.update({
            where: { id: skuId },
            data
        });
    }
    async deleteProductSku(ownerUserId, productId, skuId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { merchant: true }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.merchant.ownerId !== ownerUserId) {
            throw new common_1.ForbiddenException('You can only delete SKUs of your own products');
        }
        const sku = await this.prisma.sku.findUnique({
            where: { id: skuId }
        });
        if (!sku || sku.productId !== productId) {
            throw new common_1.NotFoundException('SKU not found');
        }
        return this.prisma.sku.delete({ where: { id: skuId } });
    }
    async create(ownerUserId, data) {
        return this.createProduct(ownerUserId, data);
    }
    async addSku(productId, data) {
        return this.prisma.sku.create({ data: { productId, ...data } });
    }
    async findOne(id) {
        return this.getProduct(id);
    }
    async search(q) {
        const result = await this.getProducts({
            page: 1,
            limit: 50,
            search: q,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        return result.products;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map