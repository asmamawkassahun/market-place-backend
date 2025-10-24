import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PriceAlertsService } from '../price-alerts/price-alerts.service';

@Injectable()
export class PriceEventsListener {
  private readonly logger = new Logger(PriceEventsListener.name);

  constructor(
    private priceAlertsService: PriceAlertsService,
  ) {}

  @OnEvent('price.updated')
  async handlePriceUpdated(payload: { skuId: string; productId: string; oldPrice: number; newPrice: number }) {
    this.logger.log(`Price updated for SKU ${payload.skuId}: ${payload.oldPrice} -> ${payload.newPrice}`);
    
    try {
      // Check if any price alerts should be triggered
      await this.priceAlertsService.checkPriceAlerts();
    } catch (error) {
      this.logger.error('Error handling price update:', error);
    }
  }
}
