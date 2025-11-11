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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const create_product_dto_1 = require("./dto/create-product.dto");
const create_sku_dto_1 = require("./dto/create-sku.dto");
let ProductsController = class ProductsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getProducts(page, limit, category, search, merchantId, isActive, sortBy, sortOrder, minPrice, maxPrice, unitType) {
        return this.service.getProducts({
            page: page || 1,
            limit: limit || 10,
            category,
            search,
            merchantId,
            isActive,
            sortBy: sortBy || 'createdAt',
            sortOrder: sortOrder || 'desc',
            minPrice,
            maxPrice,
            unitType
        });
    }
    async getMyProducts(user, page, limit, category, search, isActive, minPrice, maxPrice, unitType) {
        console.log('[ProductsController] ✅ ROUTE MATCHED: /products/me');
        console.log('[ProductsController] getMyProducts called - userId:', user?.userId, 'role:', user?.role);
        const merchant = await this.service.getMerchantByOwnerId(user.userId);
        console.log('[ProductsController] Merchant lookup result:', merchant ? { id: merchant.id } : 'NOT FOUND');
        if (!merchant) {
            console.error('[ProductsController] ❌ Merchant not found for userId:', user.userId);
            throw new common_1.NotFoundException('Merchant not found for this user. Please ensure you have a merchant account.');
        }
        const result = await this.service.getProducts({
            page: page || 1,
            limit: limit || 10,
            category,
            search,
            merchantId: merchant.id,
            isActive,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            minPrice,
            maxPrice,
            unitType
        });
        console.log('[ProductsController] ✅ Returning products:', {
            count: result.products?.length || 0,
            total: result.total,
            page: result.page
        });
        return result;
    }
    async getProduct(id) {
        console.log('[ProductsController] getProduct called with id:', id);
        if (id === 'me') {
            console.error('[ProductsController] ❌ CRITICAL ERROR: /products/me matched @Get(:id) route instead of @Get(me)!');
            console.error('[ProductsController] This means the route registration order is wrong. The @Get(me) route must be registered before @Get(:id).');
            throw new common_1.NotFoundException({
                message: 'Route registration error: /products/me should match @Get(me) but matched @Get(:id). Please restart the backend server to fix route registration order.',
                error: 'Route Registration Error',
                statusCode: 404
            });
        }
        return this.service.getProduct(id);
    }
    async getProductSkus(productId) {
        return this.service.getProductSkus(productId);
    }
    async getProductReviews(productId, page, limit) {
        return this.service.getProductReviews(productId, {
            page: page || 1,
            limit: limit || 10
        });
    }
    async getProductQnA(productId, page, limit) {
        return this.service.getProductQnA(productId, {
            page: page || 1,
            limit: limit || 10
        });
    }
    async createProduct(user, body) {
        return this.service.createProduct(user.userId, body);
    }
    async updateProduct(user, id, body) {
        return this.service.updateProduct(user.userId, id, body);
    }
    async deleteProduct(user, id) {
        return this.service.deleteProduct(user.userId, id);
    }
    async createProductSku(user, productId, body) {
        return this.service.createProductSku(user.userId, productId, body);
    }
    async updateProductSku(user, productId, skuId, body) {
        return this.service.updateProductSku(user.userId, productId, skuId, body);
    }
    async deleteProductSku(user, productId, skuId) {
        return this.service.deleteProductSku(user.userId, productId, skuId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('merchantId')),
    __param(5, (0, common_1.Query)('isActive')),
    __param(6, (0, common_1.Query)('sortBy')),
    __param(7, (0, common_1.Query)('sortOrder')),
    __param(8, (0, common_1.Query)('minPrice')),
    __param(9, (0, common_1.Query)('maxPrice')),
    __param(10, (0, common_1.Query)('unitType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Boolean, String, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('isActive')),
    __param(6, (0, common_1.Query)('minPrice')),
    __param(7, (0, common_1.Query)('maxPrice')),
    __param(8, (0, common_1.Query)('unitType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, Boolean, Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getMyProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Get)(':id/skus'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductSkus", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductReviews", null);
__decorate([
    (0, common_1.Get)(':id/qna'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductQnA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':productId/skus'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_sku_dto_1.CreateSkuDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProductSku", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':productId/skus/:skuId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Param)('skuId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProductSku", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':productId/skus/:skuId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Param)('skuId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProductSku", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map