import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StockNotificationsService } from './stock-notifications.service';
import { CreateStockNotificationDto } from './dto/create-stock-notification.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('stock-notifications')
export class StockNotificationsController {
  constructor(private readonly stockNotificationsService: StockNotificationsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createStockNotificationDto: CreateStockNotificationDto) {
    return this.stockNotificationsService.create(user.userId, createStockNotificationDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.stockNotificationsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.stockNotificationsService.findOne(id, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.stockNotificationsService.remove(id, user.userId);
  }
}
