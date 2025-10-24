import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { ManualCarrier } from './carriers/manual.carrier';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ShipmentsController],
  providers: [ShipmentsService, ManualCarrier],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}


