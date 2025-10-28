import { PriceAlertsService } from './price-alerts.service';
import { CreatePriceAlertDto } from './dto/create-price-alert.dto';
import { UpdatePriceAlertDto } from './dto/update-price-alert.dto';
export declare class PriceAlertsController {
    private readonly priceAlertsService;
    constructor(priceAlertsService: PriceAlertsService);
    create(user: any, createPriceAlertDto: CreatePriceAlertDto): Promise<{
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
        } | null;
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
        userId: string;
        isActive: boolean;
        productId: string | null;
        skuId: string | null;
        targetPrice: number;
        triggeredAt: Date | null;
    }>;
    findAll(user: any): Promise<({
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
        } | null;
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
        userId: string;
        isActive: boolean;
        productId: string | null;
        skuId: string | null;
        targetPrice: number;
        triggeredAt: Date | null;
    })[]>;
    findOne(id: string, user: any): Promise<{
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
        } | null;
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
        userId: string;
        isActive: boolean;
        productId: string | null;
        skuId: string | null;
        targetPrice: number;
        triggeredAt: Date | null;
    }>;
    update(id: string, user: any, updatePriceAlertDto: UpdatePriceAlertDto): Promise<{
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
        } | null;
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
        userId: string;
        isActive: boolean;
        productId: string | null;
        skuId: string | null;
        targetPrice: number;
        triggeredAt: Date | null;
    }>;
    remove(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isActive: boolean;
        productId: string | null;
        skuId: string | null;
        targetPrice: number;
        triggeredAt: Date | null;
    }>;
}
