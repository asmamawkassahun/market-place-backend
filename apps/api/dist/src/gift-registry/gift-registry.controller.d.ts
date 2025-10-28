import { GiftRegistryService } from './gift-registry.service';
import { CreateGiftRegistryDto } from './dto/create-gift-registry.dto';
import { UpdateGiftRegistryDto } from './dto/update-gift-registry.dto';
import { AddGiftRegistryItemDto } from './dto/add-gift-registry-item.dto';
import { MarkPurchasedDto } from './dto/mark-purchased.dto';
export declare class GiftRegistryController {
    private readonly giftRegistryService;
    constructor(giftRegistryService: GiftRegistryService);
    create(user: any, createGiftRegistryDto: CreateGiftRegistryDto): Promise<{
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
            priority: string | null;
            notes: string | null;
            productId: string;
            skuId: string | null;
            purchasedBy: string | null;
            quantityPurchased: number;
            registryId: string;
            isPurchased: boolean;
            purchasedAt: Date | null;
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
        eventDate: Date | null;
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
            priority: string | null;
            notes: string | null;
            productId: string;
            skuId: string | null;
            purchasedBy: string | null;
            quantityPurchased: number;
            registryId: string;
            isPurchased: boolean;
            purchasedAt: Date | null;
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
        eventDate: Date | null;
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
            priority: string | null;
            notes: string | null;
            productId: string;
            skuId: string | null;
            purchasedBy: string | null;
            quantityPurchased: number;
            registryId: string;
            isPurchased: boolean;
            purchasedAt: Date | null;
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
        eventDate: Date | null;
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
            priority: string | null;
            notes: string | null;
            productId: string;
            skuId: string | null;
            purchasedBy: string | null;
            quantityPurchased: number;
            registryId: string;
            isPurchased: boolean;
            purchasedAt: Date | null;
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
        eventDate: Date | null;
    }>;
    update(id: string, user: any, updateGiftRegistryDto: UpdateGiftRegistryDto): Promise<{
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
            priority: string | null;
            notes: string | null;
            productId: string;
            skuId: string | null;
            purchasedBy: string | null;
            quantityPurchased: number;
            registryId: string;
            isPurchased: boolean;
            purchasedAt: Date | null;
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
        eventDate: Date | null;
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
        eventDate: Date | null;
    }>;
    addItem(id: string, user: any, addGiftRegistryItemDto: AddGiftRegistryItemDto): Promise<{
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
        priority: string | null;
        notes: string | null;
        productId: string;
        skuId: string | null;
        purchasedBy: string | null;
        quantityPurchased: number;
        registryId: string;
        isPurchased: boolean;
        purchasedAt: Date | null;
    }>;
    markPurchased(id: string, itemId: string, markPurchasedDto: MarkPurchasedDto): Promise<{
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
        priority: string | null;
        notes: string | null;
        productId: string;
        skuId: string | null;
        purchasedBy: string | null;
        quantityPurchased: number;
        registryId: string;
        isPurchased: boolean;
        purchasedAt: Date | null;
    }>;
    removeItem(id: string, itemId: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        priority: string | null;
        notes: string | null;
        productId: string;
        skuId: string | null;
        purchasedBy: string | null;
        quantityPurchased: number;
        registryId: string;
        isPurchased: boolean;
        purchasedAt: Date | null;
    }>;
}
