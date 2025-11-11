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
    async getMerchantByOwnerId(ownerId) {
        console.log('[ProductsService] Looking up merchant for ownerId:', ownerId);
        const merchant = await this.prisma.merchant.findUnique({
            where: { ownerId },
            select: { id: true, ownerId: true, displayName: true }
        });
        console.log('[ProductsService] Merchant lookup result:', merchant ? { id: merchant.id, displayName: merchant.displayName } : 'NOT FOUND');
        return merchant;
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
        console.log('=== PRODUCT CREATION START ===');
        console.log('Owner User ID:', ownerUserId);
        console.log('Product data received:', JSON.stringify(data, null, 2));
        const merchant = await this.prisma.merchant.findUnique({ where: { ownerId: ownerUserId } });
        if (!merchant) {
            console.log('Merchant not found for user:', ownerUserId);
            throw new common_1.NotFoundException('Merchant not found for current user');
        }
        console.log('Found merchant:', merchant.id);
        const { skus, ...productData } = data;
        console.log('SKUs to create:', skus);
        return this.prisma.$transaction(async (tx) => {
            console.log('Creating product...');
            const product = await tx.product.create({
                data: {
                    merchantId: merchant.id,
                    ...productData,
                    images: productData.images || []
                }
            });
            console.log('Product created with ID:', product.id);
            if (skus && skus.length > 0) {
                console.log('Creating SKUs...');
                await Promise.all(skus.map(async (sku, index) => {
                    console.log(`Creating SKU ${index}:`, sku);
                    const skuData = {
                        productId: product.id,
                        name: sku.name || 'Default',
                        unitType: sku.unitType || 'PIECE',
                        unitIncrement: sku.unitIncrement || 1,
                        packageSize: sku.packageSize || null,
                        pricePerCanonicalUnit: Math.round(sku.pricePerCanonicalUnit || 0),
                        currency: sku.currency || 'ETB',
                        active: sku.active !== undefined ? sku.active : true,
                    };
                    console.log(`SKU ${index} data:`, skuData);
                    return tx.sku.create({ data: skuData });
                }));
                console.log('All SKUs created successfully');
            }
            const result = await tx.product.findUnique({
                where: { id: product.id },
                include: { skus: true }
            });
            console.log('=== PRODUCT CREATION SUCCESS ===');
            return result;
        });
    }
    async updateProduct(ownerUserId, productId, data) {
        try {
            console.log('=== PRODUCT UPDATE START ===');
            console.log('Owner User ID:', ownerUserId);
            console.log('Product ID:', productId);
            console.log('Update data received:', JSON.stringify(data, null, 2));
            const product = await this.prisma.product.findUnique({
                where: { id: productId },
                include: { merchant: true, skus: true }
            });
            if (!product) {
                console.log('Product not found');
                throw new common_1.NotFoundException('Product not found');
            }
            if (product.merchant.ownerId !== ownerUserId) {
                console.log('Forbidden: User does not own this product');
                throw new common_1.ForbiddenException('You can only update your own products');
            }
            const { skus, ...productData } = data;
            const allowedFields = ['name', 'slug', 'description', 'categoryId', 'images'];
            const filteredProductData = {};
            for (const key of allowedFields) {
                if (productData[key] !== undefined) {
                    filteredProductData[key] = productData[key];
                }
            }
            console.log('Filtered product data:', JSON.stringify(filteredProductData, null, 2));
            console.log('SKUs to process:', skus?.length || 0);
            return await this.prisma.$transaction(async (tx) => {
                const updatedProduct = await tx.product.update({
                    where: { id: productId },
                    data: filteredProductData
                });
                if (skus && Array.isArray(skus)) {
                    const existingSkuIds = new Set(product.skus.map(sku => sku.id));
                    const incomingSkuIds = new Set(skus
                        .filter((sku) => sku.id)
                        .map((sku) => sku.id));
                    const skusToDelete = product.skus.filter(sku => !incomingSkuIds.has(sku.id));
                    if (skusToDelete.length > 0) {
                        await tx.sku.deleteMany({
                            where: {
                                id: { in: skusToDelete.map(s => s.id) }
                            }
                        });
                    }
                    await Promise.all(skus.map(async (sku) => {
                        const skuData = {
                            name: sku.name || 'Default',
                            unitType: sku.unitType || 'PIECE',
                            unitIncrement: sku.unitIncrement || 1,
                            packageSize: sku.packageSize || null,
                            pricePerCanonicalUnit: Math.round(sku.pricePerCanonicalUnit || 0),
                            currency: sku.currency || 'ETB',
                            active: sku.active !== undefined ? sku.active : true,
                        };
                        if (sku.id && existingSkuIds.has(sku.id)) {
                            return tx.sku.update({
                                where: { id: sku.id },
                                data: skuData
                            });
                        }
                        else {
                            return tx.sku.create({
                                data: {
                                    ...skuData,
                                    productId: productId
                                }
                            });
                        }
                    }));
                }
                const result = await tx.product.findUnique({
                    where: { id: productId },
                    include: {
                        skus: true,
                        merchant: {
                            select: { id: true, displayName: true }
                        },
                        category: {
                            select: { id: true, name: true }
                        }
                    }
                });
                console.log('=== PRODUCT UPDATE SUCCESS ===');
                return result;
            });
        }
        catch (error) {
            console.error('=== PRODUCT UPDATE ERROR ===');
            console.error('Error:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
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