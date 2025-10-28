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
exports.PriceAlertsController = void 0;
const common_1 = require("@nestjs/common");
const price_alerts_service_1 = require("./price-alerts.service");
const create_price_alert_dto_1 = require("./dto/create-price-alert.dto");
const update_price_alert_dto_1 = require("./dto/update-price-alert.dto");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
let PriceAlertsController = class PriceAlertsController {
    priceAlertsService;
    constructor(priceAlertsService) {
        this.priceAlertsService = priceAlertsService;
    }
    create(user, createPriceAlertDto) {
        return this.priceAlertsService.create(user.userId, createPriceAlertDto);
    }
    findAll(user) {
        return this.priceAlertsService.findAll(user.userId);
    }
    findOne(id, user) {
        return this.priceAlertsService.findOne(id, user.userId);
    }
    update(id, user, updatePriceAlertDto) {
        return this.priceAlertsService.update(id, user.userId, updatePriceAlertDto);
    }
    remove(id, user) {
        return this.priceAlertsService.remove(id, user.userId);
    }
};
exports.PriceAlertsController = PriceAlertsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_price_alert_dto_1.CreatePriceAlertDto]),
    __metadata("design:returntype", void 0)
], PriceAlertsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PriceAlertsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PriceAlertsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_price_alert_dto_1.UpdatePriceAlertDto]),
    __metadata("design:returntype", void 0)
], PriceAlertsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PriceAlertsController.prototype, "remove", null);
exports.PriceAlertsController = PriceAlertsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('price-alerts'),
    __metadata("design:paramtypes", [price_alerts_service_1.PriceAlertsService])
], PriceAlertsController);
//# sourceMappingURL=price-alerts.controller.js.map