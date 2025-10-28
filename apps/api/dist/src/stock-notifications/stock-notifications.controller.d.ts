import { StockNotificationsService } from './stock-notifications.service';
import { CreateStockNotificationDto } from './dto/create-stock-notification.dto';
export declare class StockNotificationsController {
    private readonly stockNotificationsService;
    constructor(stockNotificationsService: StockNotificationsService);
    create(user: any, createStockNotificationDto: CreateStockNotificationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        isActive: boolean;
        productId: string;
        skuId: string | null;
        notifiedAt: Date | null;
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
    remove(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        isActive: boolean;
        productId: string;
        skuId: string | null;
        notifiedAt: Date | null;
    }>;
}
