import { PriceAlertsService } from '../price-alerts/price-alerts.service';
export declare class PriceEventsListener {
    private priceAlertsService;
    private readonly logger;
    constructor(priceAlertsService: PriceAlertsService);
    handlePriceUpdated(payload: {
        skuId: string;
        productId: string;
        oldPrice: number;
        newPrice: number;
    }): Promise<void>;
}
