import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateStockNotificationDto } from './dto/create-stock-notification.dto';
export declare class StockNotificationsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(userId: string, data: CreateStockNotificationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        isActive: boolean;
        productId: string;
        skuId: string | null;
        notifiedAt: Date | null;
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
        userId: string;
        isActive: boolean;
        productId: string;
        skuId: string | null;
        notifiedAt: Date | null;
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
        userId: string;
        isActive: boolean;
        productId: string;
        skuId: string | null;
        notifiedAt: Date | null;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        isActive: boolean;
        productId: string;
        skuId: string | null;
        notifiedAt: Date | null;
    }>;
    checkStockAndNotify(skuId: string): Promise<number>;
    checkProductStockAndNotify(productId: string): Promise<number>;
    private sendStockNotification;
}
