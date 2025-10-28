import { KycService } from './kyc.service';
export declare class KycController {
    private readonly service;
    constructor(service: KycService);
    submit(user: any, body: {
        documentUrl: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        documentUrl: string | null;
        notes: string | null;
    }>;
    review(merchantId: string, body: {
        status: 'PENDING' | 'APPROVED' | 'REJECTED';
        notes?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        documentUrl: string | null;
        notes: string | null;
    }>;
    get(merchantId: string): import("@prisma/client").Prisma.Prisma__MerchantKycClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        documentUrl: string | null;
        notes: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
