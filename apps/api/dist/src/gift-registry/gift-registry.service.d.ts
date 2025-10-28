import { PrismaService } from '../prisma/prisma.service';
import { CreateGiftRegistryDto } from './dto/create-gift-registry.dto';
import { UpdateGiftRegistryDto } from './dto/update-gift-registry.dto';
import { AddGiftRegistryItemDto } from './dto/add-gift-registry-item.dto';
import { MarkPurchasedDto } from './dto/mark-purchased.dto';
export declare class GiftRegistryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreateGiftRegistryDto): Promise<{
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
    update(id: string, userId: string, data: UpdateGiftRegistryDto): Promise<{
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
    remove(id: string, userId: string): Promise<{
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
    addItem(registryId: string, userId: string, data: AddGiftRegistryItemDto): Promise<{
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
    markPurchased(registryId: string, itemId: string, data: MarkPurchasedDto): Promise<{
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
    removeItem(registryId: string, itemId: string, userId: string): Promise<{
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
    private generateShareToken;
}
