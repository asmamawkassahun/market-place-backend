import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePriceAlertDto } from './dto/create-price-alert.dto';
import { UpdatePriceAlertDto } from './dto/update-price-alert.dto';
export declare class PriceAlertsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(userId: string, data: CreatePriceAlertDto): Promise<{
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
    findAll(userId: string): Promise<({
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
    findOne(id: string, userId: string): Promise<{
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
    update(id: string, userId: string, data: UpdatePriceAlertDto): Promise<{
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
    remove(id: string, userId: string): Promise<{
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
    checkPriceAlerts(): Promise<({
        user: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            email: string;
            role: import("@prisma/client").$Enums.Role;
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
    private sendPriceAlertNotification;
}
