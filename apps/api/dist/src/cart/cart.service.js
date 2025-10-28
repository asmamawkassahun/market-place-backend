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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findFirst({ where: { userId } });
        if (!cart)
            cart = await this.prisma.cart.create({ data: { userId } });
        return cart;
    }
    async addItem(userId, item) {
        const cart = await this.getOrCreateCart(userId);
        const sku = await this.prisma.sku.findUnique({ where: { id: item.skuId } });
        if (!sku)
            throw new common_1.BadRequestException('SKU not found');
        return this.prisma.cartItem.create({ data: { cartId: cart.id, skuId: item.skuId, quantity: item.quantity, unitPrice: sku.pricePerCanonicalUnit } });
    }
    async list(userId) {
        const cart = await this.getOrCreateCart(userId);
        return this.prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { sku: true } } } });
    }
    async removeItem(userId, cartItemId) {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.prisma.cartItem.findUnique({ where: { id: cartItemId } });
        if (!item || item.cartId !== cart.id)
            throw new common_1.BadRequestException('Item not in cart');
        return this.prisma.cartItem.delete({ where: { id: cartItemId } });
    }
    async updateItem(userId, cartItemId, data) {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.prisma.cartItem.findUnique({ where: { id: cartItemId } });
        if (!item || item.cartId !== cart.id)
            throw new common_1.BadRequestException('Item not in cart');
        if (data.quantity <= 0) {
            return this.removeItem(userId, cartItemId);
        }
        return this.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity: data.quantity }
        });
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    async getCartCount(userId) {
        const cart = await this.getOrCreateCart(userId);
        const count = await this.prisma.cartItem.aggregate({
            where: { cartId: cart.id },
            _sum: { quantity: true }
        });
        return { count: count._sum.quantity || 0 };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map