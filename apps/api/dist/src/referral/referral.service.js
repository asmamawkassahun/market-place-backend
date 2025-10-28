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
exports.ReferralService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const loyalty_service_1 = require("../loyalty/loyalty.service");
const crypto_1 = require("crypto");
let ReferralService = class ReferralService {
    prisma;
    loyaltyService;
    constructor(prisma, loyaltyService) {
        this.prisma = prisma;
        this.loyaltyService = loyaltyService;
    }
    async getOrCreateReferralCode(userId) {
        let referralCode = await this.prisma.referralCode.findFirst({
            where: {
                userId,
                isActive: true,
            },
        });
        if (!referralCode) {
            referralCode = await this.create(userId, {
                code: this.generateReferralCode(),
                rewardType: 'points',
                rewardValue: 100,
            });
        }
        return referralCode;
    }
    async create(userId, data) {
        const code = data.code || this.generateReferralCode();
        const existing = await this.prisma.referralCode.findUnique({
            where: { code },
        });
        if (existing) {
            throw new common_1.BadRequestException('Referral code already exists');
        }
        return this.prisma.referralCode.create({
            data: {
                ...data,
                userId,
                code,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.referralCode.findMany({
            where: { userId },
            include: {
                transactions: {
                    include: {
                        referee: {
                            select: {
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const code = await this.prisma.referralCode.findUnique({
            where: { id },
            include: {
                transactions: {
                    include: {
                        referee: {
                            select: {
                                name: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
        if (!code) {
            throw new common_1.NotFoundException('Referral code not found');
        }
        if (code.userId !== userId) {
            throw new common_1.NotFoundException('Referral code not found');
        }
        return code;
    }
    async useReferralCode(refereeId, data) {
        const referralCode = await this.prisma.referralCode.findUnique({
            where: { code: data.code },
        });
        if (!referralCode) {
            throw new common_1.NotFoundException('Invalid referral code');
        }
        if (!referralCode.isActive) {
            throw new common_1.BadRequestException('Referral code is not active');
        }
        if (referralCode.userId === refereeId) {
            throw new common_1.BadRequestException('Cannot use your own referral code');
        }
        if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Referral code has expired');
        }
        if (referralCode.maxUses && referralCode.currentUses >= referralCode.maxUses) {
            throw new common_1.BadRequestException('Referral code usage limit reached');
        }
        const existingTransaction = await this.prisma.referralTransaction.findFirst({
            where: {
                codeId: referralCode.id,
                refereeId,
            },
        });
        if (existingTransaction) {
            throw new common_1.BadRequestException('You have already used this referral code');
        }
        const transaction = await this.prisma.referralTransaction.create({
            data: {
                codeId: referralCode.id,
                referrerId: referralCode.userId,
                refereeId,
                orderId: data.orderId,
                rewardAmount: referralCode.rewardValue || 100,
                status: 'pending',
            },
        });
        await this.prisma.referralCode.update({
            where: { id: referralCode.id },
            data: {
                currentUses: referralCode.currentUses + 1,
            },
        });
        return transaction;
    }
    async awardReferralRewards(orderId) {
        const transactions = await this.prisma.referralTransaction.findMany({
            where: {
                orderId,
                status: 'pending',
            },
            include: {
                code: true,
            },
        });
        for (const transaction of transactions) {
            try {
                await this.loyaltyService.awardForOrder(transaction.referrerId, orderId, transaction.rewardAmount * 100);
                await this.loyaltyService.awardForOrder(transaction.refereeId, orderId, transaction.rewardAmount * 50);
                await this.prisma.referralTransaction.update({
                    where: { id: transaction.id },
                    data: {
                        status: 'awarded',
                        awardedAt: new Date(),
                    },
                });
            }
            catch (error) {
                console.error('Error awarding referral rewards:', error);
                await this.prisma.referralTransaction.update({
                    where: { id: transaction.id },
                    data: { status: 'expired' },
                });
            }
        }
    }
    async getReferralStats(userId) {
        const codes = await this.prisma.referralCode.findMany({
            where: { userId },
            include: {
                transactions: true,
            },
        });
        const totalCodes = codes.length;
        const totalUses = codes.reduce((sum, code) => sum + code.currentUses, 0);
        const totalRewards = codes.reduce((sum, code) => sum + code.transactions.filter(t => t.status === 'awarded').length * (code.rewardValue || 0), 0);
        return {
            totalCodes,
            totalUses,
            totalRewards,
            codes: codes.map(code => ({
                id: code.id,
                code: code.code,
                currentUses: code.currentUses,
                maxUses: code.maxUses,
                isActive: code.isActive,
                createdAt: code.createdAt,
            })),
        };
    }
    async getReferralTransactions(userId) {
        return this.prisma.referralTransaction.findMany({
            where: {
                OR: [
                    { referrerId: userId },
                    { refereeId: userId },
                ],
            },
            include: {
                code: {
                    select: {
                        code: true,
                    },
                },
                referrer: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
                referee: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        totalAmount: true,
                        status: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    generateReferralCode() {
        return (0, crypto_1.randomBytes)(8).toString('hex').toUpperCase();
    }
};
exports.ReferralService = ReferralService;
exports.ReferralService = ReferralService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        loyalty_service_1.LoyaltyService])
], ReferralService);
//# sourceMappingURL=referral.service.js.map