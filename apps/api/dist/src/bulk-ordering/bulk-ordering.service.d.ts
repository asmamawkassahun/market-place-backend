import { PrismaService } from '../prisma/prisma.service';
import { CreateBulkOrderDto } from './dto/create-bulk-order.dto';
import { BulkOrderQuoteRequestDto } from './dto/bulk-order-quote-request.dto';
import { CreateGroupBuyDto } from './dto/create-group-buy.dto';
import { JoinGroupBuyDto } from './dto/join-group-buy.dto';
export declare class BulkOrderingService {
    private prisma;
    constructor(prisma: PrismaService);
    createBulkOrder(userId: string, data: CreateBulkOrderDto): Promise<{
        merchant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
            legalName: string | null;
            description: string | null;
            logoUrl: string | null;
            rating: number;
            lat: number | null;
            lon: number | null;
            serviceAreas: string[];
            ownerId: string;
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
            quantity: number;
            notes: string | null;
            productId: string;
            skuId: string | null;
            unitPrice: number | null;
            totalPrice: number | null;
            bulkOrderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        currency: string;
        userId: string;
        totalAmount: number | null;
        status: string;
        notes: string | null;
    }>;
    getBulkOrderQuote(data: BulkOrderQuoteRequestDto): Promise<{
        merchantId: string;
        totalAmount: number;
        currency: string;
        items: {
            productId: string;
            skuId: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
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
            } & {
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
            };
        }[];
        validUntil: Date;
    }>;
    findAllBulkOrders(userId: string): Promise<({
        merchant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
            legalName: string | null;
            description: string | null;
            logoUrl: string | null;
            rating: number;
            lat: number | null;
            lon: number | null;
            serviceAreas: string[];
            ownerId: string;
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
            quantity: number;
            notes: string | null;
            productId: string;
            skuId: string | null;
            unitPrice: number | null;
            totalPrice: number | null;
            bulkOrderId: string;
        })[];
        quotes: {
            id: string;
            createdAt: Date;
            merchantId: string;
            currency: string;
            totalAmount: number;
            notes: string | null;
            bulkOrderId: string;
            validUntil: Date;
            acceptedAt: Date | null;
            rejectedAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        currency: string;
        userId: string;
        totalAmount: number | null;
        status: string;
        notes: string | null;
    })[]>;
    findOneBulkOrder(id: string, userId: string): Promise<{
        merchant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
            legalName: string | null;
            description: string | null;
            logoUrl: string | null;
            rating: number;
            lat: number | null;
            lon: number | null;
            serviceAreas: string[];
            ownerId: string;
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
            quantity: number;
            notes: string | null;
            productId: string;
            skuId: string | null;
            unitPrice: number | null;
            totalPrice: number | null;
            bulkOrderId: string;
        })[];
        quotes: {
            id: string;
            createdAt: Date;
            merchantId: string;
            currency: string;
            totalAmount: number;
            notes: string | null;
            bulkOrderId: string;
            validUntil: Date;
            acceptedAt: Date | null;
            rejectedAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        currency: string;
        userId: string;
        totalAmount: number | null;
        status: string;
        notes: string | null;
    }>;
    createGroupBuy(merchantId: string, data: CreateGroupBuyDto): Promise<{
        merchant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
            legalName: string | null;
            description: string | null;
            logoUrl: string | null;
            rating: number;
            lat: number | null;
            lon: number | null;
            serviceAreas: string[];
            ownerId: string;
        };
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
        participants: ({
            user: {
                name: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            userId: string;
            status: string;
            groupBuyId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        merchantId: string;
        currency: string;
        status: string;
        productId: string;
        skuId: string | null;
        startsAt: Date;
        endsAt: Date;
        targetQuantity: number;
        pricePerUnit: number;
        currentQuantity: number;
    }>;
    findAllGroupBuys(): Promise<({
        merchant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
            legalName: string | null;
            description: string | null;
            logoUrl: string | null;
            rating: number;
            lat: number | null;
            lon: number | null;
            serviceAreas: string[];
            ownerId: string;
        };
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
        participants: ({
            user: {
                name: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            userId: string;
            status: string;
            groupBuyId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        merchantId: string;
        currency: string;
        status: string;
        productId: string;
        skuId: string | null;
        startsAt: Date;
        endsAt: Date;
        targetQuantity: number;
        pricePerUnit: number;
        currentQuantity: number;
    })[]>;
    findOneGroupBuy(id: string): Promise<{
        merchant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
            legalName: string | null;
            description: string | null;
            logoUrl: string | null;
            rating: number;
            lat: number | null;
            lon: number | null;
            serviceAreas: string[];
            ownerId: string;
        };
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
        participants: ({
            user: {
                name: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            userId: string;
            status: string;
            groupBuyId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        merchantId: string;
        currency: string;
        status: string;
        productId: string;
        skuId: string | null;
        startsAt: Date;
        endsAt: Date;
        targetQuantity: number;
        pricePerUnit: number;
        currentQuantity: number;
    }>;
    joinGroupBuy(groupBuyId: string, userId: string, data: JoinGroupBuyDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        userId: string;
        status: string;
        groupBuyId: string;
    }>;
    private calculateBulkPrice;
}
