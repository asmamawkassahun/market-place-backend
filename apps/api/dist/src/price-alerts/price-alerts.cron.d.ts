import { PriceAlertsService } from './price-alerts.service';
export declare class PriceAlertsCron {
    private readonly priceAlertsService;
    private readonly logger;
    constructor(priceAlertsService: PriceAlertsService);
    checkPriceAlerts(): Promise<void>;
}
