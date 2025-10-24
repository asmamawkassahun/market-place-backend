import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BulkOrderingService } from './bulk-ordering.service';
import { CreateBulkOrderDto } from './dto/create-bulk-order.dto';
import { BulkOrderQuoteRequestDto } from './dto/bulk-order-quote-request.dto';
import { CreateGroupBuyDto } from './dto/create-group-buy.dto';
import { JoinGroupBuyDto } from './dto/join-group-buy.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('bulk-orders')
export class BulkOrderingController {
  constructor(private readonly bulkOrderingService: BulkOrderingService) {}

  @Post('quote')
  getQuote(@Body() quoteRequest: BulkOrderQuoteRequestDto) {
    return this.bulkOrderingService.getBulkOrderQuote(quoteRequest);
  }

  @Post()
  createBulkOrder(@CurrentUser() user: any, @Body() createBulkOrderDto: CreateBulkOrderDto) {
    return this.bulkOrderingService.createBulkOrder(user.userId, createBulkOrderDto);
  }

  @Get()
  findAllBulkOrders(@CurrentUser() user: any) {
    return this.bulkOrderingService.findAllBulkOrders(user.userId);
  }

  @Get(':id')
  findOneBulkOrder(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bulkOrderingService.findOneBulkOrder(id, user.userId);
  }
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('group-buys')
export class GroupBuyController {
  constructor(private readonly bulkOrderingService: BulkOrderingService) {}

  @Post()
  @Roles('MERCHANT')
  createGroupBuy(@CurrentUser() user: any, @Body() createGroupBuyDto: CreateGroupBuyDto) {
    // Get merchant ID from user
    return this.bulkOrderingService.createGroupBuy(user.merchantId, createGroupBuyDto);
  }

  @Get()
  findAllGroupBuys() {
    return this.bulkOrderingService.findAllGroupBuys();
  }

  @Get(':id')
  findOneGroupBuy(@Param('id') id: string) {
    return this.bulkOrderingService.findOneGroupBuy(id);
  }

  @Post(':id/join')
  joinGroupBuy(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() joinGroupBuyDto: JoinGroupBuyDto,
  ) {
    return this.bulkOrderingService.joinGroupBuy(id, user.userId, joinGroupBuyDto);
  }
}
