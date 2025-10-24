import { Body, Controller, Post } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly service: PricingService) {}

  @Post('quote')
  quote(@Body() body: { skuId: string; quantity: number }) {
    return this.service.quote(body.skuId, Number(body.quantity));
  }

  @Post('set')
  set(@Body() body: { skuId: string; amount: number }) {
    return this.service.setPrice(body.skuId, Number(body.amount));
  }
}


