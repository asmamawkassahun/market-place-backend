import { PrismaService } from '../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreateWishlistDto): Promise<{
        items: ({
            product: {
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
            sku: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            notes: string | null;
            productId: string;
            skuId: string | null;
            wishlistId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        isPublic: boolean;
        shareToken: string | null;
    }>;
    findAll(userId: string): Promise<({
        items: ({
            product: {
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
            sku: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            notes: string | null;
            productId: string;
            skuId: string | null;
            wishlistId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        isPublic: boolean;
        shareToken: string | null;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        items: ({
            product: {
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
            sku: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            notes: string | null;
            productId: string;
            skuId: string | null;
            wishlistId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        isPublic: boolean;
        shareToken: string | null;
    }>;
    findByShareToken(shareToken: string): Promise<{
        user: {
            name: string | null;
        };
        items: ({
            product: {
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
            sku: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            notes: string | null;
            productId: string;
            skuId: string | null;
            wishlistId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        isPublic: boolean;
        shareToken: string | null;
    }>;
    update(id: string, userId: string, data: UpdateWishlistDto): Promise<{
        items: ({
            product: {
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
            sku: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            notes: string | null;
            productId: string;
            skuId: string | null;
            wishlistId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        isPublic: boolean;
        shareToken: string | null;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        isPublic: boolean;
        shareToken: string | null;
    }>;
    addItem(wishlistId: string, userId: string, data: AddWishlistItemDto): Promise<{
        product: {
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
        sku: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        notes: string | null;
        productId: string;
        skuId: string | null;
        wishlistId: string;
    }>;
    removeItem(wishlistId: string, itemId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        notes: string | null;
        productId: string;
        skuId: string | null;
        wishlistId: string;
    }>;
    private generateShareToken;
}
