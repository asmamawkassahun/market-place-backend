"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceAlertsModule = void 0;
const common_1 = require("@nestjs/common");
const price_alerts_service_1 = require("./price-alerts.service");
const price_alerts_controller_1 = require("./price-alerts.controller");
const price_alerts_cron_1 = require("./price-alerts.cron");
const prisma_module_1 = require("../prisma/prisma.module");
const notifications_module_1 = require("../notifications/notifications.module");
const schedule_1 = require("@nestjs/schedule");
let PriceAlertsModule = class PriceAlertsModule {
};
exports.PriceAlertsModule = PriceAlertsModule;
exports.PriceAlertsModule = PriceAlertsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notifications_module_1.NotificationsModule, schedule_1.ScheduleModule],
        controllers: [price_alerts_controller_1.PriceAlertsController],
        providers: [price_alerts_service_1.PriceAlertsService, price_alerts_cron_1.PriceAlertsCron],
        exports: [price_alerts_service_1.PriceAlertsService],
    })
], PriceAlertsModule);
//# sourceMappingURL=price-alerts.module.js.map