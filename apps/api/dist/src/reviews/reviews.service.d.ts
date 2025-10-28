import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, productId: string, rating: number, comment?: string, images?: string[]): import("@prisma/client").Prisma.Prisma__ReviewClient<{
        id: string;
        createdAt: Date;
        rating: number;
        images: string[];
        userId: string;
        productId: string;
        comment: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    list(productId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        rating: number;
        images: string[];
        userId: string;
        productId: string;
        comment: string | null;
    }[]>;
}
