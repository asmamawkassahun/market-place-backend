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
var InventoryEventsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryEventsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const stock_notifications_service_1 = require("../stock-notifications/stock-notifications.service");
let InventoryEventsListener = InventoryEventsListener_1 = class InventoryEventsListener {
    stockNotificationsService;
    logger = new common_1.Logger(InventoryEventsListener_1.name);
    constructor(stockNotificationsService) {
        this.stockNotificationsService = stockNotificationsService;
    }
    async handleInventoryUpdated(payload) {
        this.logger.log(`Inventory updated for SKU ${payload.skuId}, quantity: ${payload.quantity}`);
        try {
            if (payload.quantity > 0) {
                await this.stockNotificationsService.checkStockAndNotify(payload.skuId);
            }
        }
        catch (error) {
            this.logger.error('Error handling inventory update:', error);
        }
    }
    async handleLowStock(payload) {
        this.logger.warn(`Low stock alert for SKU ${payload.skuId}: ${payload.currentQuantity} < ${payload.threshold}`);
    }
};
exports.InventoryEventsListener = InventoryEventsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('inventory.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryEventsListener.prototype, "handleInventoryUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('inventory.low-stock'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryEventsListener.prototype, "handleLowStock", null);
exports.InventoryEventsListener = InventoryEventsListener = InventoryEventsListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stock_notifications_service_1.StockNotificationsService])
], InventoryEventsListener);
//# sourceMappingURL=inventory-events.listener.js.map