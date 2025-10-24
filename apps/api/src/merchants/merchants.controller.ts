import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CreateMerchantDto } from './dto/create-merchant.dto';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly service: MerchantsService) {}

  @Get()
  async getMerchants(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
    @Query('isVerified') isVerified?: boolean,
    @Query('lat') lat?: number,
    @Query('lon') lon?: number,
    @Query('radius') radius?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.service.getMerchants({
      page: page || 1,
      limit: limit || 10,
      search,
      isActive,
      isVerified,
      lat,
      lon,
      radius: radius || 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc'
    });
  }

  @Get('nearby')
  async searchNearbyMerchants(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number = 10
  ) {
    return this.service.searchNearbyMerchants(lat, lon, radius);
  }

  @Get(':id')
  async getMerchant(@Param('id') id: string) {
    return this.service.getMerchant(id);
  }

  @Get(':id/products')
  async getMerchantProducts(
    @Param('id') merchantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('search') search?: string
  ) {
    return this.service.getMerchantProducts(merchantId, {
      page: page || 1,
      limit: limit || 10,
      category,
      search
    });
  }

  @Get(':id/orders')
  async getMerchantOrders(
    @Param('id') merchantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string
  ) {
    return this.service.getMerchantOrders(merchantId, {
      page: page || 1,
      limit: limit || 10,
      status
    });
  }

  @Get(':id/summary')
  async getMerchantSummary(@Param('id') merchantId: string) {
    return this.service.getMerchantSummary(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentMerchant(@CurrentUser() user: any) {
    return this.service.getCurrentMerchant(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMerchant(@CurrentUser() user: any, @Body() body: CreateMerchantDto) {
    return this.service.createMerchant(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMerchant(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.service.updateMerchant(user.userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMerchant(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.deleteMerchant(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/approve')
  async approveMerchant(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.approveMerchant(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reject')
  async rejectMerchant(@CurrentUser() user: any, @Param('id') id: string, @Body() body: { reason?: string }) {
    return this.service.rejectMerchant(user.userId, id, body.reason);
  }

  // Legacy methods for backward compatibility
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async update(@CurrentUser() user: any, @Body() body: any) {
    return this.service.update(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  async summary(@CurrentUser() user: any) {
    return this.service.summary(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('nearby')
  async nearby(@Body() body: { lat: number; lon: number; radiusKm?: number }) {
    return this.service.nearby(body.lat, body.lon, body.radiusKm);
  }
}


