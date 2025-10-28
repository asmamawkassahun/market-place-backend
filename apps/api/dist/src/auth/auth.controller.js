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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const email_otp_dto_1 = require("./dto/email-otp.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async requestOtp(body) {
        const result = await this.authService.requestOtp(body.email);
        return result;
    }
    async verifyOtp(body, res) {
        const { access_token, refresh_token, user } = await this.authService.verifyOtp(body.email, body.code);
        const secure = process.env.NODE_ENV !== 'development';
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure,
            sameSite: secure ? 'lax' : 'lax',
            path: '/api/auth',
            maxAge: Number(process.env.REFRESH_TTL_DAYS || 30) * 24 * 60 * 60 * 1000,
        });
        return {
            access_token,
            user,
            success: true,
            message: 'Login successful'
        };
    }
    async refresh(req, res) {
        const rt = req.cookies?.refresh_token;
        const { access_token, refresh_token } = await this.authService.refreshTokens(rt);
        const secure = process.env.NODE_ENV !== 'development';
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure,
            sameSite: secure ? 'lax' : 'lax',
            path: '/api/auth',
            maxAge: Number(process.env.REFRESH_TTL_DAYS || 30) * 24 * 60 * 60 * 1000,
        });
        return { access_token };
    }
    async revoke(req, res) {
        const rt = req.cookies?.refresh_token;
        if (rt)
            await this.authService.revokeRefreshToken(rt);
        res.clearCookie('refresh_token', { path: '/api/auth' });
        return { ok: true };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('request-otp'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_otp_dto_1.RequestEmailOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestOtp", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_otp_dto_1.VerifyEmailOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('revoke'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "revoke", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map