import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateSkuDto } from './dto/create-sku.dto';
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    getProducts(page?: number, limit?: number, category?: string, search?: string, merchantId?: string, isActive?: boolean, sortBy?: string, sortOrder?: 'asc' | 'desc', minPrice?: number, maxPrice?: number, unitType?: string): Promise<{
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
                createdAt: Date;
                id: string;
                name: string;
                updatedAt: Date;
                productId: string;
                unitType: import("@prisma/client").$Enums.UnitType;
                unitIncrement: number;
                packageSize: number | null;
                pricePerCanonicalUnit: number;
                currency: string;
                active: boolean;
            }[];
        } & {
            createdAt: Date;
            id: string;
            merchantId: string;
            categoryId: string | null;
            name: string;
            slug: string;
            description: string | null;
            images: string[];
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getMyProducts(user: any, page?: number, limit?: number, category?: string, search?: string, isActive?: boolean, minPrice?: number, maxPrice?: number, unitType?: string): Promise<{
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
                createdAt: Date;
                id: string;
                name: string;
                updatedAt: Date;
                productId: string;
                unitType: import("@prisma/client").$Enums.UnitType;
                unitIncrement: number;
                packageSize: number | null;
                pricePerCanonicalUnit: number;
                currency: string;
                active: boolean;
            }[];
        } & {
            createdAt: Date;
            id: string;
            merchantId: string;
            categoryId: string | null;
            name: string;
            slug: string;
            description: string | null;
            images: string[];
            updatedAt: Date;
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
            createdAt: Date;
            id: string;
            name: string;
            updatedAt: Date;
            productId: string;
            unitType: import("@prisma/client").$Enums.UnitType;
            unitIncrement: number;
            packageSize: number | null;
            pricePerCanonicalUnit: number;
            currency: string;
            active: boolean;
        }[];
    } & {
        createdAt: Date;
        id: string;
        merchantId: string;
        categoryId: string | null;
        name: string;
        slug: string;
        description: string | null;
        images: string[];
        updatedAt: Date;
    }>;
    getProductSkus(productId: string): Promise<{
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        productId: string;
        unitType: import("@prisma/client").$Enums.UnitType;
        unitIncrement: number;
        packageSize: number | null;
        pricePerCanonicalUnit: number;
        currency: string;
        active: boolean;
    }[]>;
    getProductReviews(productId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            user: {
                id: string;
                name: string | null;
                phone: string | null;
            };
        } & {
            createdAt: Date;
            id: string;
            images: string[];
            rating: number;
            productId: string;
            userId: string;
            comment: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getProductQnA(productId: string, page?: number, limit?: number): Promise<{
        qnas: ({
            user: {
                id: string;
                name: string | null;
                phone: string | null;
            };
        } & {
            createdAt: Date;
            id: string;
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
    createProduct(user: any, body: CreateProductDto): Promise<({
        skus: {
            createdAt: Date;
            id: string;
            name: string;
            updatedAt: Date;
            productId: string;
            unitType: import("@prisma/client").$Enums.UnitType;
            unitIncrement: number;
            packageSize: number | null;
            pricePerCanonicalUnit: number;
            currency: string;
            active: boolean;
        }[];
    } & {
        createdAt: Date;
        id: string;
        merchantId: string;
        categoryId: string | null;
        name: string;
        slug: string;
        description: string | null;
        images: string[];
        updatedAt: Date;
    }) | null>;
    updateProduct(user: any, id: string, body: any): Promise<({
        merchant: {
            id: string;
            displayName: string;
        };
        category: {
            id: string;
            name: string;
        } | null;
        skus: {
            createdAt: Date;
            id: string;
            name: string;
            updatedAt: Date;
            productId: string;
            unitType: import("@prisma/client").$Enums.UnitType;
            unitIncrement: number;
            packageSize: number | null;
            pricePerCanonicalUnit: number;
            currency: string;
            active: boolean;
        }[];
    } & {
        createdAt: Date;
        id: string;
        merchantId: string;
        categoryId: string | null;
        name: string;
        slug: string;
        description: string | null;
        images: string[];
        updatedAt: Date;
    }) | null>;
    deleteProduct(user: any, id: string): Promise<{
        createdAt: Date;
        id: string;
        merchantId: string;
        categoryId: string | null;
        name: string;
        slug: string;
        description: string | null;
        images: string[];
        updatedAt: Date;
    }>;
    createProductSku(user: any, productId: string, body: CreateSkuDto): Promise<{
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        productId: string;
        unitType: import("@prisma/client").$Enums.UnitType;
        unitIncrement: number;
        packageSize: number | null;
        pricePerCanonicalUnit: number;
        currency: string;
        active: boolean;
    }>;
    updateProductSku(user: any, productId: string, skuId: string, body: any): Promise<{
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        productId: string;
        unitType: import("@prisma/client").$Enums.UnitType;
        unitIncrement: number;
        packageSize: number | null;
        pricePerCanonicalUnit: number;
        currency: string;
        active: boolean;
    }>;
    deleteProductSku(user: any, productId: string, skuId: string): Promise<{
        createdAt: Date;
        id: string;
        name: string;
        updatedAt: Date;
        productId: string;
        unitType: import("@prisma/client").$Enums.UnitType;
        unitIncrement: number;
        packageSize: number | null;
        pricePerCanonicalUnit: number;
        currency: string;
        active: boolean;
    }>;
}
