"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockNotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const stock_notifications_service_1 = require("./stock-notifications.service");
const stock_notifications_controller_1 = require("./stock-notifications.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const notifications_module_1 = require("../notifications/notifications.module");
let StockNotificationsModule = class StockNotificationsModule {
};
exports.StockNotificationsModule = StockNotificationsModule;
exports.StockNotificationsModule = StockNotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notifications_module_1.NotificationsModule],
        controllers: [stock_notifications_controller_1.StockNotificationsController],
        providers: [stock_notifications_service_1.StockNotificationsService],
        exports: [stock_notifications_service_1.StockNotificationsService],
    })
], StockNotificationsModule);
//# sourceMappingURL=stock-notifications.module.js.map