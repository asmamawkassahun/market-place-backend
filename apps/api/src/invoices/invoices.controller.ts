import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @Get(':orderId')
  get(@Param('orderId') orderId: string) {
    return this.service.get(orderId);
  }
}


