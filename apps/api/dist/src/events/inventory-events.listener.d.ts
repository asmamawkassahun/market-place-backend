import { StockNotificationsService } from '../stock-notifications/stock-notifications.service';
export declare class InventoryEventsListener {
    private stockNotificationsService;
    private readonly logger;
    constructor(stockNotificationsService: StockNotificationsService);
    handleInventoryUpdated(payload: {
        skuId: string;
        productId: string;
        quantity: number;
    }): Promise<void>;
    handleLowStock(payload: {
        skuId: string;
        productId: string;
        currentQuantity: number;
        threshold: number;
    }): Promise<void>;
}
