import { Module } from '@nestjs/common';
import { PriceAlertsService } from './price-alerts.service';
import { PriceAlertsController } from './price-alerts.controller';
import { PriceAlertsCron } from './price-alerts.cron';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, NotificationsModule, ScheduleModule],
  controllers: [PriceAlertsController],
  providers: [PriceAlertsService, PriceAlertsCron],
  exports: [PriceAlertsService],
})
export class PriceAlertsModule {}
