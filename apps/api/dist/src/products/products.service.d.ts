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
}
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMerchantByOwnerId(ownerId: string): Promise<{
        id: string;
        displayName: string;
        ownerId: string;
    } | null>;
    getProducts(params: GetProductsParams): Promise<{
        products: ({
            category: {
                id: string;
                name: string;
            } | null;
            merchant: {
                id: string;
                displayName: string;
                rating: number;
            };
            skus: {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    searchProducts(query: string, params: Omit<GetProductsParams, 'search'>): Promise<{
        products: ({
            category: {
                id: string;
                name: string;
            } | null;
            merchant: {
                id: string;
                displayName: string;
                rating: number;
            };
            skus: {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getProduct(id: string): Promise<{
        category: {
            id: string;
            name: string;
        } | null;
        merchant: {
            id: string;
            displayName: string;
            rating: number;
        };
        skus: {
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
    }>;
    getProductSkus(productId: string): Promise<{
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
            createdAt: Date;
            rating: number;
            images: string[];
            userId: string;
            productId: string;
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
            userId: string;
            productId: string;
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
    }) | null>;
    updateProduct(ownerUserId: string, productId: string, data: any): Promise<({
        category: {
            id: string;
            name: string;
        } | null;
        merchant: {
            id: string;
            displayName: string;
        };
        skus: {
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
    }) | null>;
    deleteProduct(ownerUserId: string, productId: string): Promise<{
        id: string;
        slug: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        images: string[];
        merchantId: string;
        categoryId: string | null;
    }>;
    createProductSku(ownerUserId: string, productId: string, data: {
        name: string;
        unitType: 'PIECE' | 'KG' | 'LITER' | 'METER';
        unitIncrement: number;
        packageSize?: number;
        pricePerCanonicalUnit: number;
    }): Promise<{
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
    }>;
    updateProductSku(ownerUserId: string, productId: string, skuId: string, data: any): Promise<{
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
    }>;
    deleteProductSku(ownerUserId: string, productId: string, skuId: string): Promise<{
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
    }) | null>;
    addSku(productId: string, data: {
        name: string;
        unitType: 'PIECE' | 'KG' | 'LITER' | 'METER';
        unitIncrement: number;
        packageSize?: number;
        pricePerCanonicalUnit: number;
    }): Promise<{
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
    }>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            name: string;
        } | null;
        merchant: {
            id: string;
            displayName: string;
            rating: number;
        };
        skus: {
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
    }>;
    search(q?: string): Promise<({
        category: {
            id: string;
            name: string;
        } | null;
        merchant: {
            id: string;
            displayName: string;
            rating: number;
        };
        skus: {
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
    })[]>;
}
