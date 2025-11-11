import { InventoryService } from './inventory.service';
import { AddLotDto } from './dto/add-lot.dto';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class InventoryController {
    private readonly service;
    private readonly prisma;
    constructor(service: InventoryService, prisma: PrismaService);
    private getMerchantId;
    add(user: any, body: AddLotDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        quantity: number;
        expiry: Date | null;
        locationId: string | null;
        skuId: string;
    }>;
    list(user: any): Promise<({
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
    recordMovement(user: any, body: CreateInventoryMovementDto): Promise<{
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
    getMovements(user: any, skuId?: string, limit?: string): Promise<({
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
    getAnalytics(user: any): Promise<{
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
    getLowStockAlerts(user: any, threshold?: string): Promise<{
        skuId: string;
        skuName: string;
        productName: string;
        currentQuantity: number;
        threshold: number;
        unitType: import("@prisma/client").$Enums.UnitType;
    }[]>;
}
