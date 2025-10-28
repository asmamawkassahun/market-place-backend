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
var PriceEventsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceEventsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const price_alerts_service_1 = require("../price-alerts/price-alerts.service");
let PriceEventsListener = PriceEventsListener_1 = class PriceEventsListener {
    priceAlertsService;
    logger = new common_1.Logger(PriceEventsListener_1.name);
    constructor(priceAlertsService) {
        this.priceAlertsService = priceAlertsService;
    }
    async handlePriceUpdated(payload) {
        this.logger.log(`Price updated for SKU ${payload.skuId}: ${payload.oldPrice} -> ${payload.newPrice}`);
        try {
            await this.priceAlertsService.checkPriceAlerts();
        }
        catch (error) {
            this.logger.error('Error handling price update:', error);
        }
    }
};
exports.PriceEventsListener = PriceEventsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('price.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PriceEventsListener.prototype, "handlePriceUpdated", null);
exports.PriceEventsListener = PriceEventsListener = PriceEventsListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [price_alerts_service_1.PriceAlertsService])
], PriceEventsListener);
//# sourceMappingURL=price-events.listener.js.map