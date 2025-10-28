import { PrismaService } from '../prisma/prisma.service';
export declare class CatalogService {
    private prisma;
    constructor(prisma: PrismaService);
    createCategory(data: {
        name: string;
        slug: string;
        parentId?: string;
    }): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        slug: string;
        name: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    listCategories(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        slug: string;
        name: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
