import { PrismaService } from '../prisma/prisma.service';
export declare class PricingService {
    private prisma;
    constructor(prisma: PrismaService);
    setPrice(skuId: string, amount: number): import("@prisma/client").Prisma.Prisma__PriceClient<{
        id: string;
        createdAt: Date;
        skuId: string;
        amount: number;
        startsAt: Date;
        endsAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    quote(skuId: string, quantity: number): Promise<{
        amount: number;
    }>;
}
