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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const sms_service_1 = require("../sms/sms.service");
const crypto_1 = require("crypto");
function hashSecret(secret) {
    return (0, crypto_1.createHash)('sha256').update(secret).digest('hex');
}
let AuthService = class AuthService {
    prisma;
    jwt;
    smsService;
    constructor(prisma, jwt, smsService) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.smsService = smsService;
    }
    async requestOtp(email) {
        try {
            console.log(`[AuthService] Starting requestOtp for email: ${email}`);
            const otp = this.smsService.generateOtp();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            console.log(`[AuthService] Generated OTP: ${otp}`);
            console.log(`[AuthService] Creating/updating user...`);
            const user = await this.prisma.user.upsert({
                where: { email },
                update: {},
                create: { email, phone: null, role: 'USER' },
            });
            console.log(`[AuthService] User ready: ${user.id}`);
            console.log(`[AuthService] Cleaning up old OTPs...`);
            const deletedCount = await this.prisma.otp.deleteMany({
                where: {
                    email: email,
                    OR: [
                        { expiresAt: { lt: new Date() } },
                        { used: true }
                    ]
                }
            });
            console.log(`[AuthService] Deleted ${deletedCount.count} old OTPs`);
            console.log(`[AuthService] Creating new OTP record...`);
            const otpRecord = await this.prisma.otp.create({
                data: {
                    email: email,
                    code: otp,
                    expiresAt
                }
            });
            console.log(`[AuthService] OTP record created: ${otpRecord.id}`);
            console.log(`[AuthService] Sending OTP via email...`);
            const emailSent = await this.smsService.sendOtp(email, otp);
            console.log(`[AuthService] Email send result: ${emailSent}`);
            if (!emailSent) {
                throw new Error('Failed to send email');
            }
            console.log(`[AuthService] OTP request successful`);
            return {
                success: true,
                message: 'OTP sent successfully to your email'
            };
        }
        catch (error) {
            console.error(`[AuthService] Error in requestOtp:`, error);
            console.error(`[AuthService] Error stack:`, error.stack);
            throw new common_1.BadRequestException('Failed to send OTP. Please try again.');
        }
    }
    async issueAccessToken(user) {
        const payload = { sub: user.id, role: user.role, email: user.email };
        return this.jwt.signAsync(payload);
    }
    async issueRefreshToken(userId) {
        const tokenId = (0, crypto_1.randomBytes)(16).toString('hex');
        const secret = (0, crypto_1.randomBytes)(32).toString('hex');
        const secretHash = hashSecret(secret);
        const ttlDays = Number(process.env.REFRESH_TTL_DAYS || 30);
        const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
        await this.prisma.createRefreshToken({ userId, tokenId, secretHash, expiresAt });
        return { tokenId, secret };
    }
    async verifyOtp(email, code) {
        const otpRecord = await this.prisma.otp.findFirst({
            where: {
                email: email,
                code,
                used: false,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });
        if (!otpRecord) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        await this.prisma.otp.update({
            where: { id: otpRecord.id },
            data: { used: true }
        });
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const access_token = await this.issueAccessToken(user);
        const rt = await this.issueRefreshToken(user.id);
        const refresh_token = `${rt.tokenId}.${rt.secret}`;
        return {
            access_token,
            refresh_token,
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                role: user.role
            }
        };
    }
    async refreshTokens(compound) {
        const [tokenId, secret] = (compound || '').split('.');
        if (!tokenId || !secret)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        const record = await this.prisma.findRefreshTokenByTokenId(tokenId);
        if (!record || record.revokedAt || record.expiresAt < new Date())
            throw new common_1.UnauthorizedException('Invalid refresh token');
        if (record.secretHash !== hashSecret(secret))
            throw new common_1.UnauthorizedException('Invalid refresh token');
        const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        await this.prisma.revokeRefreshTokenByTokenId(tokenId, new Date());
        const access_token = await this.issueAccessToken(user);
        const rt = await this.issueRefreshToken(user.id);
        const refresh_token = `${rt.tokenId}.${rt.secret}`;
        return { access_token, refresh_token };
    }
    async revokeRefreshToken(compound) {
        const [tokenId] = (compound || '').split('.');
        if (!tokenId)
            return { ok: true };
        await this.prisma.revokeRefreshTokenByTokenId(tokenId, new Date()).catch(() => undefined);
        return { ok: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        sms_service_1.SmsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map