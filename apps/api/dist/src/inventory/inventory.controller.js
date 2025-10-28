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
let InventoryController = class InventoryController {
    service;
    constructor(service) {
        this.service = service;
    }
    add(user, body) {
        return this.service.addLot(user.merchantId, body);
    }
    list(user) {
        return this.service.listForMerchant(user.merchantId);
    }
    recordMovement(user, body) {
        return this.service.recordMovement(user.merchantId, body, user.userId);
    }
    getMovements(user, skuId, limit) {
        return this.service.getMovements(user.merchantId, skuId, limit ? parseInt(limit) : 50);
    }
    getAnalytics(user) {
        return this.service.getInventoryAnalytics(user.merchantId);
    }
    getLowStockAlerts(user, threshold) {
        return this.service.getLowStockAlerts(user.merchantId, threshold ? parseInt(threshold) : 10);
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
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "add", null);
__decorate([
    (0, common_1.Get)('lots'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('movements'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_inventory_movement_dto_1.CreateInventoryMovementDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "recordMovement", null);
__decorate([
    (0, common_1.Get)('movements'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('skuId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getMovements", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLowStockAlerts", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map