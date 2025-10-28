import { PrismaService } from '../prisma/prisma.service';
export declare class KycService {
    private prisma;
    constructor(prisma: PrismaService);
    submit(ownerId: string, data: {
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
    review(merchantId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED', notes?: string): Promise<{
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
