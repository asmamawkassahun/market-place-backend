import { PrismaService } from '../prisma/prisma.service';
import { VisualSearchDto } from './dto/visual-search.dto';
export declare class VisualSearchService {
    private prisma;
    constructor(prisma: PrismaService);
    searchSimilarProducts(data: VisualSearchDto): Promise<{
        query: {
            imageUrl: string;
            filters: {
                categoryId: string | undefined;
                minPrice: number | undefined;
                maxPrice: number | undefined;
            };
        };
        results: {
            similarityScore: number;
            matchReason: string;
            product: {
                category: {
                    id: string;
                    slug: string;
                    name: string;
                    parentId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
                merchant: {
                    displayName: string;
                    rating: number;
                };
            } & {
                id: string;
                slug: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                images: string[];
                merchantId: string;
                categoryId: string | null;
            };
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            unitType: import("@prisma/client").$Enums.UnitType;
            unitIncrement: number;
            packageSize: number | null;
            pricePerCanonicalUnit: number;
            currency: string;
            active: boolean;
            productId: string;
        }[];
        totalResults: number;
        searchId: string;
    }>;
    private generateMockMatchReason;
    private generateSearchId;
    analyzeImage(imageUrl: string): Promise<any>;
}
