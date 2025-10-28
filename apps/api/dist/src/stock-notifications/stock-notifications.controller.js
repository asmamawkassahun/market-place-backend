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
exports.StockNotificationsController = void 0;
const common_1 = require("@nestjs/common");
const stock_notifications_service_1 = require("./stock-notifications.service");
const create_stock_notification_dto_1 = require("./dto/create-stock-notification.dto");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
let StockNotificationsController = class StockNotificationsController {
    stockNotificationsService;
    constructor(stockNotificationsService) {
        this.stockNotificationsService = stockNotificationsService;
    }
    create(user, createStockNotificationDto) {
        return this.stockNotificationsService.create(user.userId, createStockNotificationDto);
    }
    findAll(user) {
        return this.stockNotificationsService.findAll(user.userId);
    }
    findOne(id, user) {
        return this.stockNotificationsService.findOne(id, user.userId);
    }
    remove(id, user) {
        return this.stockNotificationsService.remove(id, user.userId);
    }
};
exports.StockNotificationsController = StockNotificationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_stock_notification_dto_1.CreateStockNotificationDto]),
    __metadata("design:returntype", void 0)
], StockNotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StockNotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StockNotificationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StockNotificationsController.prototype, "remove", null);
exports.StockNotificationsController = StockNotificationsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('stock-notifications'),
    __metadata("design:paramtypes", [stock_notifications_service_1.StockNotificationsService])
], StockNotificationsController);
//# sourceMappingURL=stock-notifications.controller.js.map