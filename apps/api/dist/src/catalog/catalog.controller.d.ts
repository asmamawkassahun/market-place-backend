import { CatalogService } from './catalog.service';
export declare class CatalogController {
    private readonly service;
    constructor(service: CatalogService);
    listCategories(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        slug: string;
        name: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
