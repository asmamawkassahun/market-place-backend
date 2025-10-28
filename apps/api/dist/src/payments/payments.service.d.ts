import { PrismaService } from '../prisma/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
type Provider = 'telebirr' | 'chapa' | 'amole' | 'cod';
export declare class PaymentsService {
    private prisma;
    private loyalty;
    constructor(prisma: PrismaService, loyalty: LoyaltyService);
    initiate(paymentId: string, provider: Provider): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        orderId: string;
        provider: string;
        amount: number;
    }>;
    capture(paymentId: string): Promise<{
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: string;
            amount: number;
        };
        escrow: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.EscrowStatus;
            paymentId: string;
            holdAmount: number;
            released: number;
        };
    }>;
}
export {};
