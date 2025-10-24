import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Post('product/:productId')
  create(@CurrentUser() user: any, @Param('productId') productId: string, @Body() body: CreateReviewDto) {
    return this.service.create(user.userId, productId, body.rating, body.comment, body.images);
  }

  @Get('product/:productId')
  list(@Param('productId') productId: string) {
    return this.service.list(productId);
  }
}


