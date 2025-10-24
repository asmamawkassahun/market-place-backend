import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('payouts')
export class PayoutsController {
  constructor(private readonly service: PayoutsService) {}

  @Post('request')
  request(@CurrentUser() user: any, @Body() body: { amount: number }) {
    return this.service.request(user.userId, Number(body.amount));
  }

  @Get('mine')
  list(@CurrentUser() user: any) {
    return this.service.listForMerchant(user.userId);
  }
}


