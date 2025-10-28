import { PrismaService } from '../prisma/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { CreateReferralCodeDto } from './dto/create-referral-code.dto';
import { UseReferralCodeDto } from './dto/use-referral-code.dto';
export declare class ReferralService {
    private prisma;
    private loyaltyService;
    constructor(prisma: PrismaService, loyaltyService: LoyaltyService);
    getOrCreateReferralCode(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        code: string;
        userId: string;
        isActive: boolean;
        maxUses: number | null;
        rewardType: string;
        rewardValue: number | null;
        currentUses: number;
    }>;
    create(userId: string, data: CreateReferralCodeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        code: string;
        userId: string;
        isActive: boolean;
        maxUses: number | null;
        rewardType: string;
        rewardValue: number | null;
        currentUses: number;
    }>;
    findAll(userId: string): Promise<({
        transactions: ({
            referee: {
                name: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            orderId: string | null;
            codeId: string;
            referrerId: string;
            refereeId: string;
            rewardAmount: number;
            awardedAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        code: string;
        userId: string;
        isActive: boolean;
        maxUses: number | null;
        rewardType: string;
        rewardValue: number | null;
        currentUses: number;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        transactions: ({
            referee: {
                name: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            orderId: string | null;
            codeId: string;
            referrerId: string;
            refereeId: string;
            rewardAmount: number;
            awardedAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        code: string;
        userId: string;
        isActive: boolean;
        maxUses: number | null;
        rewardType: string;
        rewardValue: number | null;
        currentUses: number;
    }>;
    useReferralCode(refereeId: string, data: UseReferralCodeDto): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        orderId: string | null;
        codeId: string;
        referrerId: string;
        refereeId: string;
        rewardAmount: number;
        awardedAt: Date | null;
    }>;
    awardReferralRewards(orderId: string): Promise<void>;
    getReferralStats(userId: string): Promise<{
        totalCodes: number;
        totalUses: number;
        totalRewards: number;
        codes: {
            id: string;
            code: string;
            currentUses: number;
            maxUses: number | null;
            isActive: boolean;
            createdAt: Date;
        }[];
    }>;
    getReferralTransactions(userId: string): Promise<({
        order: {
            id: string;
            totalAmount: number;
            status: import("@prisma/client").$Enums.OrderStatus;
        } | null;
        code: {
            code: string;
        };
        referrer: {
            name: string | null;
            phone: string | null;
        };
        referee: {
            name: string | null;
            phone: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        orderId: string | null;
        codeId: string;
        referrerId: string;
        refereeId: string;
        rewardAmount: number;
        awardedAt: Date | null;
    })[]>;
    private generateReferralCode;
}
