import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StockNotificationsService } from '../stock-notifications/stock-notifications.service';

@Injectable()
export class InventoryEventsListener {
  private readonly logger = new Logger(InventoryEventsListener.name);

  constructor(
    private stockNotificationsService: StockNotificationsService,
  ) {}

  @OnEvent('inventory.updated')
  async handleInventoryUpdated(payload: { skuId: string; productId: string; quantity: number }) {
    this.logger.log(`Inventory updated for SKU ${payload.skuId}, quantity: ${payload.quantity}`);
    
    try {
      // Check if stock is now available and notify subscribers
      if (payload.quantity > 0) {
        await this.stockNotificationsService.checkStockAndNotify(payload.skuId);
      }
    } catch (error) {
      this.logger.error('Error handling inventory update:', error);
    }
  }

  @OnEvent('inventory.low-stock')
  async handleLowStock(payload: { skuId: string; productId: string; currentQuantity: number; threshold: number }) {
    this.logger.warn(`Low stock alert for SKU ${payload.skuId}: ${payload.currentQuantity} < ${payload.threshold}`);
    
    // Here you could send notifications to merchants about low stock
    // For now, just log it
  }
}
