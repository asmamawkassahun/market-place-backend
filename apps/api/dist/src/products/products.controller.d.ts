import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateSkuDto } from './dto/create-sku.dto';
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    getProducts(page?: number, limit?: number, category?: string, search?: string, merchantId?: string, isActive?: boolean, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
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
    getMyProducts(user: any, page?: number, limit?: number, category?: string, search?: string, isActive?: boolean): Promise<{
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
    getProductReviews(productId: string, page?: number, limit?: number): Promise<{
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
    getProductQnA(productId: string, page?: number, limit?: number): Promise<{
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
    createProduct(user: any, body: CreateProductDto): Promise<({
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
    updateProduct(user: any, id: string, body: any): Promise<({
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
    deleteProduct(user: any, id: string): Promise<{
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
    createProductSku(user: any, productId: string, body: CreateSkuDto): Promise<{
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
    updateProductSku(user: any, productId: string, skuId: string, body: any): Promise<{
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
    deleteProductSku(user: any, productId: string, skuId: string): Promise<{
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
}
