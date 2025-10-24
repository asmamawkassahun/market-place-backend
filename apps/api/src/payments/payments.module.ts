import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { TelebirrProvider } from './providers/telebirr.provider';
import { ChapaProvider } from './providers/chapa.provider';
import { AmoleProvider } from './providers/amole.provider';
import { CodProvider } from './providers/cod.provider';

@Module({
  imports: [LoyaltyModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, TelebirrProvider, ChapaProvider, AmoleProvider, CodProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}


