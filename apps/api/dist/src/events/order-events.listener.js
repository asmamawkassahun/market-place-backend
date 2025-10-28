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
var OrderEventsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEventsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const referral_service_1 = require("../referral/referral.service");
let OrderEventsListener = OrderEventsListener_1 = class OrderEventsListener {
    referralService;
    logger = new common_1.Logger(OrderEventsListener_1.name);
    constructor(referralService) {
        this.referralService = referralService;
    }
    async handleOrderCompleted(payload) {
        this.logger.log(`Order completed: ${payload.orderId} for user ${payload.userId}`);
        try {
            await this.referralService.awardReferralRewards(payload.orderId);
        }
        catch (error) {
            this.logger.error('Error handling order completion:', error);
        }
    }
};
exports.OrderEventsListener = OrderEventsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('order.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderEventsListener.prototype, "handleOrderCompleted", null);
exports.OrderEventsListener = OrderEventsListener = OrderEventsListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [referral_service_1.ReferralService])
], OrderEventsListener);
//# sourceMappingURL=order-events.listener.js.map