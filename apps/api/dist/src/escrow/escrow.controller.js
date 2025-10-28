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
exports.EscrowController = void 0;
const common_1 = require("@nestjs/common");
const escrow_service_1 = require("./escrow.service");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const escrow_dto_1 = require("./dto/escrow.dto");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
let EscrowController = class EscrowController {
    service;
    constructor(service) {
        this.service = service;
    }
    get(paymentId) {
        return this.service.getByPaymentId(paymentId);
    }
    dispute(paymentId, body) {
        return this.service.dispute(paymentId, body.reason);
    }
    release(paymentId, body) {
        return this.service.release(paymentId, body.amount);
    }
    refund(paymentId, body) {
        return this.service.refund(paymentId, body.amount);
    }
};
exports.EscrowController = EscrowController;
__decorate([
    (0, common_1.Get)(':paymentId'),
    __param(0, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(':paymentId/dispute'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('paymentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, escrow_dto_1.DisputeDto]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "dispute", null);
__decorate([
    (0, common_1.Patch)(':paymentId/release'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('paymentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, escrow_dto_1.ReleaseDto]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "release", null);
__decorate([
    (0, common_1.Patch)(':paymentId/refund'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('paymentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, escrow_dto_1.RefundDto]),
    __metadata("design:returntype", void 0)
], EscrowController.prototype, "refund", null);
exports.EscrowController = EscrowController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('escrow'),
    __metadata("design:paramtypes", [escrow_service_1.EscrowService])
], EscrowController);
//# sourceMappingURL=escrow.controller.js.map