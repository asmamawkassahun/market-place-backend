import { ReferralService } from './referral.service';
import { CreateReferralCodeDto } from './dto/create-referral-code.dto';
import { UseReferralCodeDto } from './dto/use-referral-code.dto';
export declare class ReferralController {
    private readonly referralService;
    constructor(referralService: ReferralService);
    getOrCreateCode(user: any): Promise<{
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
    createCode(user: any, createReferralCodeDto: CreateReferralCodeDto): Promise<{
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
    findAll(user: any): Promise<({
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
    findOne(id: string, user: any): Promise<{
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
    useCode(user: any, useReferralCodeDto: UseReferralCodeDto): Promise<{
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
    getStats(user: any): Promise<{
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
    getTransactions(user: any): Promise<({
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
}
