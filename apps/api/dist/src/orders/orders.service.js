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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMerchantByOwnerId(ownerId) {
        return this.prisma.merchant.findUnique({
            where: { ownerId },
            select: { id: true }
        });
    }
    async createFromCart(userId, addressId, paymentProvider) {
        const cart = await this.prisma.cart.findFirst({ where: { userId }, include: { items: { include: { sku: { include: { product: true } } } } } });
        if (!cart || cart.items.length === 0)
            throw new common_1.BadRequestException('Cart is empty');
        const merchantId = cart.items[0].sku.product.merchantId;
        const totalAmount = cart.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({ data: { userId, merchantId, addressId, totalAmount } });
            for (const it of cart.items) {
                await tx.orderItem.create({ data: { orderId: order.id, skuId: it.skuId, requestedQty: it.quantity, unitPrice: it.unitPrice } });
            }
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
            const payment = await tx.payment.create({ data: { orderId: order.id, provider: paymentProvider, amount: totalAmount } });
            await tx.escrow.create({ data: { paymentId: payment.id, holdAmount: totalAmount } });
            return { orderId: order.id, paymentId: payment.id };
        });
    }
    list(userId) {
        return this.prisma.order.findMany({ where: { userId }, include: { items: true, payments: true, shipments: true } });
    }
    async getOrders(userId, params) {
        const { page, limit, status, merchantId, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (status)
            where.status = status;
        if (merchantId)
            where.merchantId = merchantId;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    items: {
                        include: {
                            sku: {
                                include: {
                                    product: {
                                        select: { name: true, images: true }
                                    }
                                }
                            }
                        }
                    },
                    payments: true,
                    shipments: true,
                    merchant: {
                        select: { id: true, displayName: true }
                    },
                    address: {
                        select: { fullName: true, line1: true, city: true }
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
    async getOrder(userId, id) {
        const order = await this.prisma.order.findFirst({
            where: { id, userId },
            include: {
                items: {
                    include: {
                        sku: {
                            include: {
                                product: {
                                    select: { name: true, images: true }
                                }
                            }
                        }
                    }
                },
                payments: true,
                shipments: {
                    include: {
                        events: true
                    }
                },
                merchant: {
                    select: { id: true, displayName: true, rating: true }
                },
                address: true
            }
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        return order;
    }
    async createOrder(userId, data) {
        throw new common_1.BadRequestException('Direct order creation not implemented. Use createFromCart instead.');
    }
    async updateOrder(userId, id, data) {
        const order = await this.prisma.order.findFirst({
            where: { id, userId }
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        return this.prisma.order.update({
            where: { id },
            data
        });
    }
    async cancelOrder(userId, id, reason) {
        const order = await this.prisma.order.findFirst({
            where: { id, userId }
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        if (order.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Order is already cancelled');
        }
        if (order.status === 'DELIVERED') {
            throw new common_1.BadRequestException('Cannot cancel delivered order');
        }
        return this.prisma.order.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                updatedAt: new Date()
            }
        });
    }
    async updateOrderStatus(userId, id, status) {
        const order = await this.prisma.order.findFirst({
            where: { id, userId }
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        return this.prisma.order.update({
            where: { id },
            data: {
                status: status,
                updatedAt: new Date()
            }
        });
    }
    async getOrderItems(userId, orderId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId }
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        return this.prisma.orderItem.findMany({
            where: { orderId },
            include: {
                sku: {
                    include: {
                        product: {
                            select: { name: true, images: true }
                        }
                    }
                }
            }
        });
    }
    async getOrderTracking(userId, orderId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId }
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        const shipments = await this.prisma.shipment.findMany({
            where: { orderId },
            include: {
                events: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        return {
            orderId,
            status: order.status,
            shipments
        };
    }
    async getOrderInvoice(userId, orderId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId },
            include: {
                invoice: true,
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
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        if (!order.invoice) {
            throw new common_1.BadRequestException('Invoice not found for this order');
        }
        return {
            invoice: order.invoice,
            order: {
                id: order.id,
                totalAmount: order.totalAmount,
                currency: order.currency,
                createdAt: order.createdAt
            },
            items: order.items
        };
    }
    async getMerchantOrders(merchantId, params) {
        const { page, limit, status, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const where = { merchantId };
        if (status)
            where.status = status;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, phone: true, name: true }
                    },
                    items: {
                        include: {
                            sku: {
                                include: {
                                    product: {
                                        select: { name: true, images: true }
                                    }
                                }
                            }
                        }
                    },
                    payments: true,
                    shipments: true,
                    address: {
                        select: { fullName: true, line1: true, city: true }
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map