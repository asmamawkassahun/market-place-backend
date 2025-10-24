import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PriceAlertsService } from './price-alerts.service';
import { CreatePriceAlertDto } from './dto/create-price-alert.dto';
import { UpdatePriceAlertDto } from './dto/update-price-alert.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('price-alerts')
export class PriceAlertsController {
  constructor(private readonly priceAlertsService: PriceAlertsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createPriceAlertDto: CreatePriceAlertDto) {
    return this.priceAlertsService.create(user.userId, createPriceAlertDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.priceAlertsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.priceAlertsService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePriceAlertDto: UpdatePriceAlertDto,
  ) {
    return this.priceAlertsService.update(id, user.userId, updatePriceAlertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.priceAlertsService.remove(id, user.userId);
  }
}
