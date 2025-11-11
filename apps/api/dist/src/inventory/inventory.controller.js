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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const current_user_decorator_1 = require("../common/current-user.decorator");
const add_lot_dto_1 = require("./dto/add-lot.dto");
const create_inventory_movement_dto_1 = require("./dto/create-inventory-movement.dto");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryController = class InventoryController {
    service;
    prisma;
    constructor(service, prisma) {
        this.service = service;
        this.prisma = prisma;
    }
    async getMerchantId(userId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { ownerId: userId },
            select: { id: true }
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found for this user');
        }
        return merchant.id;
    }
    async add(user, body) {
        const merchantId = await this.getMerchantId(user.userId);
        return this.service.addLot(merchantId, body);
    }
    async list(user) {
        const merchantId = await this.getMerchantId(user.userId);
        return this.service.listForMerchant(merchantId);
    }
    async recordMovement(user, body) {
        const merchantId = await this.getMerchantId(user.userId);
        return this.service.recordMovement(merchantId, body, user.userId);
    }
    async getMovements(user, skuId, limit) {
        const merchantId = await this.getMerchantId(user.userId);
        return this.service.getMovements(merchantId, skuId, limit ? parseInt(limit) : 50);
    }
    async getAnalytics(user) {
        const merchantId = await this.getMerchantId(user.userId);
        return this.service.getInventoryAnalytics(merchantId);
    }
    async getLowStockAlerts(user, threshold) {
        const merchantId = await this.getMerchantId(user.userId);
        return this.service.getLowStockAlerts(merchantId, threshold ? parseInt(threshold) : 10);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('lots'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_lot_dto_1.AddLotDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "add", null);
__decorate([
    (0, common_1.Get)('lots'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('movements'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_inventory_movement_dto_1.CreateInventoryMovementDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "recordMovement", null);
__decorate([
    (0, common_1.Get)('movements'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('skuId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getMovements", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLowStockAlerts", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService,
        prisma_service_1.PrismaService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map