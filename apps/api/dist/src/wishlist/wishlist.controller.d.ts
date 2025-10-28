import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    create(user: any, createWishlistDto: CreateWishlistDto): Promise<{
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
    findAll(user: any): Promise<({
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
    findOne(id: string, user: any): Promise<{
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
    update(id: string, user: any, updateWishlistDto: UpdateWishlistDto): Promise<{
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
    remove(id: string, user: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        userId: string;
        isPublic: boolean;
        shareToken: string | null;
    }>;
    addItem(id: string, user: any, addWishlistItemDto: AddWishlistItemDto): Promise<{
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
    removeItem(id: string, itemId: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        notes: string | null;
        productId: string;
        skuId: string | null;
        wishlistId: string;
    }>;
}
