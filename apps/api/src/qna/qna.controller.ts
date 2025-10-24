import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { QnaService } from './qna.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { QnaDto } from './dto/qna.dto';

@UseGuards(JwtAuthGuard)
@Controller('qna')
export class QnaController {
  constructor(private readonly service: QnaService) {}

  @Post('ask/:productId')
  ask(@CurrentUser() user: any, @Param('productId') productId: string, @Body() body: QnaDto) {
    return this.service.ask(user.userId, productId, body.question);
  }

  @Post('answer/:qnaId')
  answer(@Param('qnaId') qnaId: string, @Body() body: { answer: string }) {
    return this.service.answer(qnaId, body.answer);
  }

  @Get('product/:productId')
  list(@Param('productId') productId: string) {
    return this.service.list(productId);
  }
}


