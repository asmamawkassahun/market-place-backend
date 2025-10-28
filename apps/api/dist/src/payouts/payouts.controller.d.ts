import { PayoutsService } from './payouts.service';
export declare class PayoutsController {
    private readonly service;
    constructor(service: PayoutsService);
    request(user: any, body: {
        amount: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        merchantId: string;
        status: string;
        amount: number;
        processedAt: Date | null;
    }>;
    list(user: any): import("@prisma/client").Prisma.Prisma__MerchantClient<({
        payouts: {
            id: string;
            createdAt: Date;
            merchantId: string;
            status: string;
            amount: number;
            processedAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        legalName: string | null;
        description: string | null;
        logoUrl: string | null;
        rating: number;
        lat: number | null;
        lon: number | null;
        serviceAreas: string[];
        ownerId: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
