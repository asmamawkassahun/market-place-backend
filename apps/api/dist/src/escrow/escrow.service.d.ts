import { PrismaService } from '../prisma/prisma.service';
export declare class EscrowService {
    private prisma;
    constructor(prisma: PrismaService);
    getByPaymentId(paymentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.EscrowStatus;
        paymentId: string;
        holdAmount: number;
        released: number;
    }>;
    dispute(paymentId: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        paymentId: string;
        extId: string | null;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }>;
    release(paymentId: string, amount?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.EscrowStatus;
        paymentId: string;
        holdAmount: number;
        released: number;
    }>;
    refund(paymentId: string, amount?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.EscrowStatus;
        paymentId: string;
        holdAmount: number;
        released: number;
    }>;
}
