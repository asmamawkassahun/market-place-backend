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
exports.ShipmentsController = void 0;
const common_1 = require("@nestjs/common");
const shipments_service_1 = require("./shipments.service");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const confirm_shipment_dto_1 = require("./dto/confirm-shipment.dto");
let ShipmentsController = class ShipmentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(orderId) {
        return this.service.create(orderId);
    }
    confirm(shipmentId, body) {
        return this.service.confirmDelivery(shipmentId, body.otp);
    }
};
exports.ShipmentsController = ShipmentsController;
__decorate([
    (0, common_1.Post)('create/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShipmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('confirm/:shipmentId'),
    __param(0, (0, common_1.Param)('shipmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, confirm_shipment_dto_1.ConfirmShipmentDto]),
    __metadata("design:returntype", void 0)
], ShipmentsController.prototype, "confirm", null);
exports.ShipmentsController = ShipmentsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('shipments'),
    __metadata("design:paramtypes", [shipments_service_1.ShipmentsService])
], ShipmentsController);
//# sourceMappingURL=shipments.controller.js.map