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
exports.MerchantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MerchantsService = class MerchantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(ownerId, data) {
        console.log('=== MERCHANTS SERVICE CREATE ===');
        console.log('Owner ID:', ownerId);
        console.log('Data received:', JSON.stringify(data, null, 2));
        const exists = await this.prisma.merchant.findUnique({ where: { ownerId } });
        if (exists) {
            console.log('Merchant already exists for owner:', ownerId);
            throw new common_1.BadRequestException('Merchant already exists for this owner');
        }
        console.log('Creating merchant in database...');
        return this.prisma.$transaction(async (tx) => {
            const merchantData = {
                ownerId,
                displayName: data.displayName,
                legalName: data.legalName,
                description: data.description,
                logoUrl: data.logoUrl || null,
                lat: data.lat || null,
                lon: data.lon || null,
                serviceAreas: data.serviceAreas ?? []
            };
            console.log('Merchant data for DB:', JSON.stringify(merchantData, null, 2));
            const merchant = await tx.merchant.create({ data: merchantData });
            console.log('Merchant created with ID:', merchant.id);
            await tx.user.update({ where: { id: ownerId }, data: { role: 'MERCHANT' } });
            console.log('User role updated to MERCHANT');
            console.log('=== MERCHANTS SERVICE SUCCESS ===');
            return merchant;
        });
    }
    async me(ownerId) {
        const m = await this.prisma.merchant.findUnique({
            where: { ownerId },
            include: {
                payout: true,
                kyc: true,
                owner: {
                    select: {
                        id: true,
                        email: true,
                        phone: true,
                        name: true
                    }
                }
            }
        });
        if (!m)
            throw new common_1.NotFoundException('Merchant not found');
        return m;
    }
    async update(ownerId, data) {
        const m = await this.prisma.merchant.findUnique({ where: { ownerId } });
        if (!m)
            throw new common_1.NotFoundException('Merchant not found');
        return this.prisma.merchant.update({ where: { ownerId }, data });
    }
    async nearby(lat, lon, radiusKm = 25) {
        const all = await this.prisma.merchant.findMany({ where: { lat: { not: null }, lon: { not: null } } });
        const R = 6371;
        const toRad = (d) => (d * Math.PI) / 180;
        const within = all.filter((m) => {
            if (m.lat == null || m.lon == null)
                return false;
            const dLat = toRad(m.lat - lat);
            const dLon = toRad(m.lon - lon);
            const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(m.lat)) * Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c;
            return d <= radiusKm;
        });
        return within;
    }
    async summary(ownerId) {
        const m = await this.prisma.merchant.findUnique({ where: { ownerId } });
        if (!m)
            throw new common_1.NotFoundException('Merchant not found');
        const totals = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { merchantId: m.id, status: { in: ['DELIVERED', 'SHIPPED', 'CONFIRMED'] } },
        });
        const items = await this.prisma.orderItem.count({ where: { order: { merchantId: m.id } } });
        return { totalSalesETB: (totals._sum.totalAmount ?? 0) / 100, itemsSold: items };
    }
    async getMerchants(params) {
        const { page, limit, search, isActive, isVerified, lat, lon, radius, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search)
            where.displayName = { contains: search, mode: 'insensitive' };
        if (isActive !== undefined)
            where.owner = { role: isActive ? 'MERCHANT' : 'USER' };
        if (isVerified !== undefined)
            where.kyc = { status: isVerified ? 'APPROVED' : 'PENDING' };
        const [merchants, total] = await Promise.all([
            this.prisma.merchant.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    owner: {
                        select: { id: true, phone: true, name: true }
                    },
                    kyc: {
                        select: { status: true }
                    }
                }
            }),
            this.prisma.merchant.count({ where })
        ]);
        return {
            merchants,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async searchNearbyMerchants(lat, lon, radius) {
        return this.nearby(lat, lon, radius);
    }
    async getMerchant(id) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id },
            include: {
                owner: {
                    select: { id: true, phone: true, name: true }
                },
                kyc: {
                    select: { status: true }
                }
            }
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        return merchant;
    }
    async getMerchantProducts(merchantId, params) {
        const { page, limit, category, search } = params;
        const skip = (page - 1) * limit;
        const where = { merchantId };
        if (category)
            where.categoryId = category;
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    skus: true,
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
    async getMerchantOrders(merchantId, params) {
        const { page, limit, status } = params;
        const skip = (page - 1) * limit;
        const where = { merchantId };
        if (status)
            where.status = status;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: { id: true, phone: true, name: true }
                    },
                    items: {
                        include: {
                            sku: {
                                include: {
                                    product: {
                                        select: { name: true }
                                    }
                                }
                            }
                        }
                    }
                }
            }),
            this.prisma.order.count({ where })
        ]);
        return {
            orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getMerchantSummary(merchantId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId }
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        const totals = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { merchantId, status: { in: ['DELIVERED', 'SHIPPED', 'CONFIRMED'] } },
        });
        const items = await this.prisma.orderItem.count({
            where: { order: { merchantId } }
        });
        const productCount = await this.prisma.product.count({
            where: { merchantId }
        });
        return {
            totalSalesETB: (totals._sum.totalAmount ?? 0) / 100,
            itemsSold: items,
            productCount,
            rating: merchant.rating
        };
    }
    async getCurrentMerchant(ownerId) {
        return this.me(ownerId);
    }
    async createMerchant(ownerId, data) {
        return this.create(ownerId, data);
    }
    async updateMerchant(ownerId, id, data) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id }
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        if (merchant.ownerId !== ownerId) {
            throw new common_1.BadRequestException('You can only update your own merchant profile');
        }
        const { payout, ...merchantData } = data;
        return this.prisma.$transaction(async (tx) => {
            const updatedMerchant = await tx.merchant.update({
                where: { id },
                data: merchantData
            });
            if (payout && payout.method && payout.accountRef) {
                const existingPayout = await tx.merchantPayout.findUnique({
                    where: { merchantId: id }
                });
                if (existingPayout) {
                    await tx.merchantPayout.update({
                        where: { merchantId: id },
                        data: {
                            method: payout.method,
                            accountRef: payout.accountRef
                        }
                    });
                }
                else {
                    await tx.merchantPayout.create({
                        data: {
                            merchantId: id,
                            method: payout.method,
                            accountRef: payout.accountRef
                        }
                    });
                }
            }
            return updatedMerchant;
        });
    }
    async deleteMerchant(ownerId, id) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id }
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        if (merchant.ownerId !== ownerId) {
            throw new common_1.BadRequestException('You can only delete your own merchant profile');
        }
        return this.prisma.merchant.delete({ where: { id } });
    }
    async approveMerchant(ownerId, id) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id },
            include: { kyc: true }
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        if (!merchant.kyc) {
            throw new common_1.BadRequestException('Merchant KYC not found');
        }
        return this.prisma.merchantKyc.update({
            where: { merchantId: id },
            data: { status: 'APPROVED' }
        });
    }
    async rejectMerchant(ownerId, id, reason) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id },
            include: { kyc: true }
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        if (!merchant.kyc) {
            throw new common_1.BadRequestException('Merchant KYC not found');
        }
        return this.prisma.merchantKyc.update({
            where: { merchantId: id },
            data: {
                status: 'REJECTED',
                notes: reason || 'Rejected by admin'
            }
        });
    }
};
exports.MerchantsService = MerchantsService;
exports.MerchantsService = MerchantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MerchantsService);
//# sourceMappingURL=merchants.service.js.map