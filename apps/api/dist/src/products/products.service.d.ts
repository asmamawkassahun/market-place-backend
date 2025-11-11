import { PrismaService } from '../prisma/prisma.service';
export interface GetProductsParams {
    page: number;
    limit: number;
    category?: string;
    search?: string;
    merchantId?: string;
    isActive?: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    unitType?: string;
}
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMerchantByOwnerId(ownerId: string): Promise<{
        id: string;
        ownerId: string;
        displayName: string;
    } | null>;
    getProducts(params: GetProductsParams): Promise<{
        products: ({
            merchant: {
                id: string;
                displayName: string;
                rating: number;
            };
            category: {
                id: string;
                name: string;
            } | null;
            skus: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                productId: string;
                unitType: import("@prisma/client").$Enums.UnitType;
                unitIncrement: number;
                packageSize: number | null;
                pricePerCanonicalUnit: number;
                currency: string;
                active: boolean;
            }[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            merchantId: string;
            categoryId: string | null;
            slug: string;
            images: string[];
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    searchProducts(query: string, params: Omit<GetProductsParams, 'search'>): Promise<{
        products: ({
            merchant: {
                id: string;
                displayName: string;
                rating: number;
            };
            category: {
                id: string;
                name: string;
            } | null;
            skus: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                productId: string;
                unitType: import("@prisma/client").$Enums.UnitType;
                unitIncrement: number;
                packageSize: number | null;
                pricePerCanonicalUnit: number;
                currency: string;
                active: boolean;
            }[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            merchantId: string;
            categoryId: string | null;
            slug: string;
            images: string[];
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getProduct(id: string): Promise<{
        merchant: {
            id: string;
            displayName: string;
            rating: number;
        };
        category: {
            id: string;
            name: string;
        } | null;
        skus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            productId: string;
            unitType: import("@prisma/client").$Enums.UnitType;
            unitIncrement: number;
            packageSize: number | null;
            pricePerCanonicalUnit: number;
            currency: string;
            active: boolean;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        merchantId: string;
        categoryId: string | null;
        slug: string;
        images: string[];
    }>;
    getProductSkus(productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        productId: string;
        unitType: import("@prisma/client").$Enums.UnitType;
        unitIncrement: number;
        packageSize: number | null;
        pricePerCanonicalUnit: number;
        currency: string;
        active: boolean;
    }[]>;
    getProductReviews(productId: string, params: {
        page: number;
        limit: number;
    }): Promise<{
        reviews: ({
            user: {
                id: string;
                name: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            rating: number;
            createdAt: Date;
            images: string[];
            productId: string;
            userId: string;
            comment: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getProductQnA(productId: string, params: {
        page: number;
        limit: number;
    }): Promise<{
        qnas: ({
            user: {
                id: string;
                name: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            userId: string;
            question: string;
            answer: string | null;
            answeredAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    createProduct(ownerUserId: string, data: {
        name: string;
        slug: string;
        categoryId?: string;
        description?: string;
        images?: string[];
        skus?: any[];
    }): Promise<({
        skus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            productId: string;
            unitType: import("@prisma/client").$Enums.UnitType;
            unitIncrement: number;
            packageSize: number | null;
            pricePerCanonicalUnit: number;
            currency: string;
            active: boolean;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        merchantId: string;
        categoryId: string | null;
        slug: string;
        images: string[];
    }) | null>;
    updateProduct(ownerUserId: string, productId: string, data: any): Promise<({
        merchant: {
            id: string;
            displayName: string;
        };
        category: {
            id: string;
            name: string;
        } | null;
        skus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            productId: string;
            unitType: import("@prisma/client").$Enums.UnitType;
            unitIncrement: number;
            packageSize: number | null;
            pricePerCanonicalUnit: number;
            currency: string;
            active: boolean;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        merchantId: string;
        categoryId: string | null;
        slug: string;
        images: string[];
    }) | null>;
    deleteProduct(ownerUserId: string, productId: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        merchantId: string;
        categoryId: string | null;
        slug: string;
        images: string[];
    }>;
    createProductSku(ownerUserId: string, productId: string, data: {
        name: string;
        unitType: 'PIECE' | 'KG' | 'LITER' | 'METER';
        unitIncrement: number;
        packageSize?: number;
        pricePerCanonicalUnit: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        productId: string;
        unitType: import("@prisma/client").$Enums.UnitType;
        unitIncrement: number;
        packageSize: number | null;
        pricePerCanonicalUnit: number;
        currency: string;
        active: boolean;
    }>;
    updateProductSku(ownerUserId: string, productId: string, skuId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        productId: string;
        unitType: import("@prisma/client").$Enums.UnitType;
        unitIncrement: number;
        packageSize: number | null;
        pricePerCanonicalUnit: number;
        currency: string;
        active: boolean;
    }>;
    deleteProductSku(ownerUserId: string, productId: string, skuId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        productId: string;
        unitType: import("@prisma/client").$Enums.UnitType;
        unitIncrement: number;
        packageSize: number | null;
        pricePerCanonicalUnit: number;
        currency: string;
        active: boolean;
    }>;
    create(ownerUserId: string, data: {
        name: string;
        slug: string;
        categoryId?: string;
        description?: string;
        images?: string[];
    }): Promise<({
        skus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            productId: string;
            unitType: import("@prisma/client").$Enums.UnitType;
            unitIncrement: number;
            packageSize: number | null;
            pricePerCanonicalUnit: number;
            currency: string;
            active: boolean;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        merchantId: string;
        categoryId: string | null;
        slug: string;
        images: string[];
    }) | null>;
    addSku(productId: string, data: {
        name: string;
        unitType: 'PIECE' | 'KG' | 'LITER' | 'METER';
        unitIncrement: number;
        packageSize?: number;
        pricePerCanonicalUnit: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        productId: string;
        unitType: import("@prisma/client").$Enums.UnitType;
        unitIncrement: number;
        packageSize: number | null;
        pricePerCanonicalUnit: number;
        currency: string;
        active: boolean;
    }>;
    findOne(id: string): Promise<{
        merchant: {
            id: string;
            displayName: string;
            rating: number;
        };
        category: {
            id: string;
            name: string;
        } | null;
        skus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            productId: string;
            unitType: import("@prisma/client").$Enums.UnitType;
            unitIncrement: number;
            packageSize: number | null;
            pricePerCanonicalUnit: number;
            currency: string;
            active: boolean;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        merchantId: string;
        categoryId: string | null;
        slug: string;
        images: string[];
    }>;
    search(q?: string): Promise<({
        merchant: {
            id: string;
            displayName: string;
            rating: number;
        };
        category: {
            id: string;
            name: string;
        } | null;
        skus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            productId: string;
            unitType: import("@prisma/client").$Enums.UnitType;
            unitIncrement: number;
            packageSize: number | null;
            pricePerCanonicalUnit: number;
            currency: string;
            active: boolean;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        merchantId: string;
        categoryId: string | null;
        slug: string;
        images: string[];
    })[]>;
}
