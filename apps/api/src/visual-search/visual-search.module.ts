import { Module } from '@nestjs/common';
import { VisualSearchService } from './visual-search.service';
import { VisualSearchController } from './visual-search.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VisualSearchController],
  providers: [VisualSearchService],
  exports: [VisualSearchService],
})
export class VisualSearchModule {}
