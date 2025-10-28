import { PrismaService } from '../prisma/prisma.service';
export declare class LoyaltyService {
    private prisma;
    constructor(prisma: PrismaService);
    awardForOrder(userId: string, orderId: string, amountCents: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        reason: string;
        points: number;
    } | null>;
}
