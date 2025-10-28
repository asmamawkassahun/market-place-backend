import { PricingService } from './pricing.service';
export declare class PricingController {
    private readonly service;
    constructor(service: PricingService);
    quote(body: {
        skuId: string;
        quantity: number;
    }): Promise<{
        amount: number;
    }>;
    set(body: {
        skuId: string;
        amount: number;
    }): import("@prisma/client").Prisma.Prisma__PriceClient<{
        id: string;
        createdAt: Date;
        skuId: string;
        amount: number;
        startsAt: Date;
        endsAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
