import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('kyc')
export class KycController {
  constructor(private readonly service: KycService) {}

  @Post('submit')
  submit(@CurrentUser() user: any, @Body() body: { documentUrl: string }) {
    return this.service.submit(user.userId, body);
  }

  @Post('review/:merchantId')
  review(@Param('merchantId') merchantId: string, @Body() body: { status: 'PENDING'|'APPROVED'|'REJECTED'; notes?: string }) {
    return this.service.review(merchantId, body.status, body.notes);
  }

  @Get(':merchantId')
  get(@Param('merchantId') merchantId: string) {
    return this.service.get(merchantId);
  }
}


