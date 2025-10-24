import { Body, Controller, Get, Param, Post, UseGuards, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import { AddLotDto } from './dto/add-lot.dto';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Post('lots')
  @Roles('MERCHANT')
  add(@CurrentUser() user: any, @Body() body: AddLotDto) {
    return this.service.addLot(user.merchantId, body);
  }

  @Get('lots')
  @Roles('MERCHANT')
  list(@CurrentUser() user: any) {
    return this.service.listForMerchant(user.merchantId);
  }

  @Post('movements')
  @Roles('MERCHANT')
  recordMovement(@CurrentUser() user: any, @Body() body: CreateInventoryMovementDto) {
    return this.service.recordMovement(user.merchantId, body, user.userId);
  }

  @Get('movements')
  @Roles('MERCHANT')
  getMovements(
    @CurrentUser() user: any,
    @Query('skuId') skuId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getMovements(user.merchantId, skuId, limit ? parseInt(limit) : 50);
  }

  @Get('analytics')
  @Roles('MERCHANT')
  getAnalytics(@CurrentUser() user: any) {
    return this.service.getInventoryAnalytics(user.merchantId);
  }

  @Get('alerts')
  @Roles('MERCHANT')
  getLowStockAlerts(
    @CurrentUser() user: any,
    @Query('threshold') threshold?: string,
  ) {
    return this.service.getLowStockAlerts(user.merchantId, threshold ? parseInt(threshold) : 10);
  }
}


