import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { DisputeDto, RefundDto, ReleaseDto } from './dto/escrow.dto';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('escrow')
export class EscrowController {
  constructor(private readonly service: EscrowService) {}

  @Get(':paymentId')
  get(@Param('paymentId') paymentId: string) {
    return this.service.getByPaymentId(paymentId);
  }

  @Post(':paymentId/dispute')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  dispute(@Param('paymentId') paymentId: string, @Body() body: DisputeDto) {
    return this.service.dispute(paymentId, body.reason);
  }

  @Patch(':paymentId/release')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  release(@Param('paymentId') paymentId: string, @Body() body: ReleaseDto) {
    return this.service.release(paymentId, body.amount);
  }

  @Patch(':paymentId/refund')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  refund(@Param('paymentId') paymentId: string, @Body() body: RefundDto) {
    return this.service.refund(paymentId, body.amount);
  }
}


