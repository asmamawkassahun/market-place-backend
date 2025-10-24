import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('merchantId') merchantId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.service.getOrders(user.userId, {
      page: page || 1,
      limit: limit || 10,
      status,
      merchantId,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc'
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrder(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.getOrder(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@CurrentUser() user: any, @Body() body: any) {
    return this.service.createOrder(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-from-cart')
  async createFromCart(@CurrentUser() user: any, @Body() body: { addressId: string; paymentProvider: string }) {
    return this.service.createFromCart(user.userId, body.addressId, body.paymentProvider);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateOrder(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.service.updateOrder(user.userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  async cancelOrder(@CurrentUser() user: any, @Param('id') id: string, @Body() body: { reason?: string }) {
    return this.service.cancelOrder(user.userId, id, body.reason);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateOrderStatus(@CurrentUser() user: any, @Param('id') id: string, @Body() body: { status: string }) {
    return this.service.updateOrderStatus(user.userId, id, body.status);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/items')
  async getOrderItems(@CurrentUser() user: any, @Param('id') orderId: string) {
    return this.service.getOrderItems(user.userId, orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/tracking')
  async getOrderTracking(@CurrentUser() user: any, @Param('id') orderId: string) {
    return this.service.getOrderTracking(user.userId, orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/invoice')
  async getOrderInvoice(@CurrentUser() user: any, @Param('id') orderId: string) {
    return this.service.getOrderInvoice(user.userId, orderId);
  }

  // Legacy method for backward compatibility
  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@CurrentUser() user: any) {
    return this.service.list(user.userId);
  }
}


