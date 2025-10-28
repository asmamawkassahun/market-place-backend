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
exports.ReferralController = void 0;
const common_1 = require("@nestjs/common");
const referral_service_1 = require("./referral.service");
const create_referral_code_dto_1 = require("./dto/create-referral-code.dto");
const use_referral_code_dto_1 = require("./dto/use-referral-code.dto");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
let ReferralController = class ReferralController {
    referralService;
    constructor(referralService) {
        this.referralService = referralService;
    }
    getOrCreateCode(user) {
        return this.referralService.getOrCreateReferralCode(user.userId);
    }
    createCode(user, createReferralCodeDto) {
        return this.referralService.create(user.userId, createReferralCodeDto);
    }
    findAll(user) {
        return this.referralService.findAll(user.userId);
    }
    findOne(id, user) {
        return this.referralService.findOne(id, user.userId);
    }
    useCode(user, useReferralCodeDto) {
        return this.referralService.useReferralCode(user.userId, useReferralCodeDto);
    }
    getStats(user) {
        return this.referralService.getReferralStats(user.userId);
    }
    getTransactions(user) {
        return this.referralService.getReferralTransactions(user.userId);
    }
};
exports.ReferralController = ReferralController;
__decorate([
    (0, common_1.Get)('code'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "getOrCreateCode", null);
__decorate([
    (0, common_1.Post)('code'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_referral_code_dto_1.CreateReferralCodeDto]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "createCode", null);
__decorate([
    (0, common_1.Get)('codes'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('codes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('use'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, use_referral_code_dto_1.UseReferralCodeDto]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "useCode", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('transactions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReferralController.prototype, "getTransactions", null);
exports.ReferralController = ReferralController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('referral'),
    __metadata("design:paramtypes", [referral_service_1.ReferralService])
], ReferralController);
//# sourceMappingURL=referral.controller.js.map