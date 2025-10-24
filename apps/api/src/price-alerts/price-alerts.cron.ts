import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PriceAlertsService } from './price-alerts.service';

@Injectable()
export class PriceAlertsCron {
  private readonly logger = new Logger(PriceAlertsCron.name);

  constructor(private readonly priceAlertsService: PriceAlertsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkPriceAlerts() {
    this.logger.log('Running price alerts check...');
    
    try {
      const triggeredAlerts = await this.priceAlertsService.checkPriceAlerts();
      this.logger.log(`Triggered ${triggeredAlerts.length} price alerts`);
    } catch (error) {
      this.logger.error('Error checking price alerts:', error);
    }
  }
}
