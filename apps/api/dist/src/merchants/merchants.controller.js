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
exports.MerchantsController = void 0;
const common_1 = require("@nestjs/common");
const merchants_service_1 = require("./merchants.service");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const create_merchant_dto_1 = require("./dto/create-merchant.dto");
let MerchantsController = class MerchantsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getMerchants(page, limit, search, isActive, isVerified, lat, lon, radius, sortBy, sortOrder) {
        return this.service.getMerchants({
            page: page || 1,
            limit: limit || 10,
            search,
            isActive,
            isVerified,
            lat,
            lon,
            radius: radius || 10,
            sortBy: sortBy || 'createdAt',
            sortOrder: sortOrder || 'desc'
        });
    }
    async searchNearbyMerchants(lat, lon, radius = 10) {
        return this.service.searchNearbyMerchants(lat, lon, radius);
    }
    async getMerchant(id) {
        return this.service.getMerchant(id);
    }
    async getMerchantProducts(merchantId, page, limit, category, search) {
        return this.service.getMerchantProducts(merchantId, {
            page: page || 1,
            limit: limit || 10,
            category,
            search
        });
    }
    async getMerchantOrders(merchantId, page, limit, status) {
        return this.service.getMerchantOrders(merchantId, {
            page: page || 1,
            limit: limit || 10,
            status
        });
    }
    async getMerchantSummary(merchantId) {
        return this.service.getMerchantSummary(merchantId);
    }
    async getCurrentMerchant(user) {
        return this.service.getCurrentMerchant(user.userId);
    }
    async createMerchant(user, body) {
        try {
            console.log('=== MERCHANT CREATION START ===');
            console.log('User ID:', user.userId);
            console.log('User object:', user);
            console.log('Merchant data received:', JSON.stringify(body, null, 2));
            const result = await this.service.createMerchant(user.userId, body);
            console.log('Merchant created successfully:', result.id);
            console.log('=== MERCHANT CREATION SUCCESS ===');
            return result;
        }
        catch (error) {
            console.error('=== MERCHANT CREATION ERROR ===');
            console.error('Error details:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('=== END ERROR ===');
            throw error;
        }
    }
    async updateMerchant(user, id, body) {
        return this.service.updateMerchant(user.userId, id, body);
    }
    async deleteMerchant(user, id) {
        return this.service.deleteMerchant(user.userId, id);
    }
    async approveMerchant(user, id) {
        return this.service.approveMerchant(user.userId, id);
    }
    async rejectMerchant(user, id, body) {
        return this.service.rejectMerchant(user.userId, id, body.reason);
    }
    async update(user, body) {
        return this.service.update(user.userId, body);
    }
    async summary(user) {
        return this.service.summary(user.userId);
    }
    async nearby(body) {
        return this.service.nearby(body.lat, body.lon, body.radiusKm);
    }
};
exports.MerchantsController = MerchantsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('isActive')),
    __param(4, (0, common_1.Query)('isVerified')),
    __param(5, (0, common_1.Query)('lat')),
    __param(6, (0, common_1.Query)('lon')),
    __param(7, (0, common_1.Query)('radius')),
    __param(8, (0, common_1.Query)('sortBy')),
    __param(9, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Boolean, Boolean, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getMerchants", null);
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lon')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "searchNearbyMerchants", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getMerchant", null);
__decorate([
    (0, common_1.Get)(':id/products'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getMerchantProducts", null);
__decorate([
    (0, common_1.Get)(':id/orders'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getMerchantOrders", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getMerchantSummary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getCurrentMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_merchant_dto_1.CreateMerchantDto]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "createMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "updateMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "deleteMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "approveMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "rejectMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('update'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('summary'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "summary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "nearby", null);
exports.MerchantsController = MerchantsController = __decorate([
    (0, common_1.Controller)('merchants'),
    __metadata("design:paramtypes", [merchants_service_1.MerchantsService])
], MerchantsController);
//# sourceMappingURL=merchants.controller.js.map