import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReferralService } from './referral.service';
import { CreateReferralCodeDto } from './dto/create-referral-code.dto';
import { UseReferralCodeDto } from './dto/use-referral-code.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('code')
  getOrCreateCode(@CurrentUser() user: any) {
    return this.referralService.getOrCreateReferralCode(user.userId);
  }

  @Post('code')
  createCode(@CurrentUser() user: any, @Body() createReferralCodeDto: CreateReferralCodeDto) {
    return this.referralService.create(user.userId, createReferralCodeDto);
  }

  @Get('codes')
  findAll(@CurrentUser() user: any) {
    return this.referralService.findAll(user.userId);
  }

  @Get('codes/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.referralService.findOne(id, user.userId);
  }

  @Post('use')
  useCode(@CurrentUser() user: any, @Body() useReferralCodeDto: UseReferralCodeDto) {
    return this.referralService.useReferralCode(user.userId, useReferralCodeDto);
  }

  @Get('stats')
  getStats(@CurrentUser() user: any) {
    return this.referralService.getReferralStats(user.userId);
  }

  @Get('transactions')
  getTransactions(@CurrentUser() user: any) {
    return this.referralService.getReferralTransactions(user.userId);
  }
}
