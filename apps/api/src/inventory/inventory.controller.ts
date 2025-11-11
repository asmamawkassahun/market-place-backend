import { Body, Controller, Get, Param, Post, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CurrentUser } from '../common/current-user.decorator';
import { AddLotDto } from './dto/add-lot.dto';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly service: InventoryService,
    private readonly prisma: PrismaService
  ) {}

  private async getMerchantId(userId: string): Promise<string> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { ownerId: userId },
      select: { id: true }
    });
    if (!merchant) {
      throw new NotFoundException('Merchant not found for this user');
    }
    return merchant.id;
  }

  @Post('lots')
  @Roles('MERCHANT')
  async add(@CurrentUser() user: any, @Body() body: AddLotDto) {
    const merchantId = await this.getMerchantId(user.userId);
    return this.service.addLot(merchantId, body);
  }

  @Get('lots')
  @Roles('MERCHANT')
  async list(@CurrentUser() user: any) {
    const merchantId = await this.getMerchantId(user.userId);
    return this.service.listForMerchant(merchantId);
  }

  @Post('movements')
  @Roles('MERCHANT')
  async recordMovement(@CurrentUser() user: any, @Body() body: CreateInventoryMovementDto) {
    const merchantId = await this.getMerchantId(user.userId);
    return this.service.recordMovement(merchantId, body, user.userId);
  }

  @Get('movements')
  @Roles('MERCHANT')
  async getMovements(
    @CurrentUser() user: any,
    @Query('skuId') skuId?: string,
    @Query('limit') limit?: string,
  ) {
    const merchantId = await this.getMerchantId(user.userId);
    return this.service.getMovements(merchantId, skuId, limit ? parseInt(limit) : 50);
  }

  @Get('analytics')
  @Roles('MERCHANT')
  async getAnalytics(@CurrentUser() user: any) {
    const merchantId = await this.getMerchantId(user.userId);
    return this.service.getInventoryAnalytics(merchantId);
  }

  @Get('alerts')
  @Roles('MERCHANT')
  async getLowStockAlerts(
    @CurrentUser() user: any,
    @Query('threshold') threshold?: string,
  ) {
    const merchantId = await this.getMerchantId(user.userId);
    return this.service.getLowStockAlerts(merchantId, threshold ? parseInt(threshold) : 10);
  }
}


