import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('initiate')
  initiate(@Body() body: { paymentId: string; provider: 'telebirr'|'chapa'|'amole'|'cod' }) {
    return this.service.initiate(body.paymentId, body.provider);
  }

  @Post('capture')
  capture(@Body() body: { paymentId: string }) {
    return this.service.capture(body.paymentId);
  }
}


