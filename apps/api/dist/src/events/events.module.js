"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const inventory_events_listener_1 = require("./inventory-events.listener");
const price_events_listener_1 = require("./price-events.listener");
const order_events_listener_1 = require("./order-events.listener");
const stock_notifications_module_1 = require("../stock-notifications/stock-notifications.module");
const price_alerts_module_1 = require("../price-alerts/price-alerts.module");
const referral_module_1 = require("../referral/referral.module");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            stock_notifications_module_1.StockNotificationsModule,
            price_alerts_module_1.PriceAlertsModule,
            referral_module_1.ReferralModule,
        ],
        providers: [
            inventory_events_listener_1.InventoryEventsListener,
            price_events_listener_1.PriceEventsListener,
            order_events_listener_1.OrderEventsListener,
        ],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map