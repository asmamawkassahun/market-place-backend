import { Module } from '@nestjs/common';
import { GiftRegistryService } from './gift-registry.service';
import { GiftRegistryController } from './gift-registry.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GiftRegistryController],
  providers: [GiftRegistryService],
  exports: [GiftRegistryService],
})
export class GiftRegistryModule {}
