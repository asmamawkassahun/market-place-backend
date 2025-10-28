import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    addLot(merchantId: string, data: {
        skuId: string;
        quantity: number;
        expiry?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        quantity: number;
        expiry: Date | null;
        locationId: string | null;
        skuId: string;
    }>;
    listForMerchant(merchantId: string): Promise<({
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        quantity: number;
        expiry: Date | null;
        locationId: string | null;
        skuId: string;
    })[]>;
    recordMovement(merchantId: string, data: CreateInventoryMovementDto, createdBy?: string): Promise<{
        id: string;
        createdAt: Date;
        merchantId: string;
        quantity: number;
        skuId: string;
        type: string;
        reason: string | null;
        referenceId: string | null;
        createdBy: string | null;
    }>;
    getMovements(merchantId: string, skuId?: string, limit?: number): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        merchantId: string;
        quantity: number;
        skuId: string;
        type: string;
        reason: string | null;
        referenceId: string | null;
        createdBy: string | null;
    })[]>;
    getInventoryAnalytics(merchantId: string): Promise<{
        totalValue: number;
        totalItems: number;
        lowStockItems: number;
        lowStockAlerts: {
            skuId: string;
            skuName: string;
            currentQuantity: number;
            productName: string;
        }[];
        recentMovements: Record<string, number>;
        totalMovements: number;
    }>;
    getLowStockAlerts(merchantId: string, threshold?: number): Promise<{
        skuId: string;
        skuName: string;
        productName: string;
        currentQuantity: number;
        threshold: number;
        unitType: import("@prisma/client").$Enums.UnitType;
    }[]>;
    private updateInventoryLot;
}
