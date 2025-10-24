import { Module } from '@nestjs/common';
import { BulkOrderingService } from './bulk-ordering.service';
import { BulkOrderingController, GroupBuyController } from './bulk-ordering.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BulkOrderingController, GroupBuyController],
  providers: [BulkOrderingService],
  exports: [BulkOrderingService],
})
export class BulkOrderingModule {}
