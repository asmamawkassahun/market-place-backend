import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly service;
    constructor(service: PaymentsService);
    initiate(body: {
        paymentId: string;
        provider: 'telebirr' | 'chapa' | 'amole' | 'cod';
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        orderId: string;
        provider: string;
        amount: number;
    }>;
    capture(body: {
        paymentId: string;
    }): Promise<{
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
