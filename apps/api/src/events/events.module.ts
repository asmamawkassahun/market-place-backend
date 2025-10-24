import { Module } from '@nestjs/common';
import { InventoryEventsListener } from './inventory-events.listener';
import { PriceEventsListener } from './price-events.listener';
import { OrderEventsListener } from './order-events.listener';
import { StockNotificationsModule } from '../stock-notifications/stock-notifications.module';
import { PriceAlertsModule } from '../price-alerts/price-alerts.module';
import { ReferralModule } from '../referral/referral.module';

@Module({
  imports: [
    StockNotificationsModule,
    PriceAlertsModule,
    ReferralModule,
  ],
  providers: [
    InventoryEventsListener,
    PriceEventsListener,
    OrderEventsListener,
  ],
})
export class EventsModule {}
