import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get()
  list(@CurrentUser() user: any) {
    return this.service.list(user.userId);
  }

  @Post('items')
  add(@CurrentUser() user: any, @Body() body: AddCartItemDto) {
    return this.service.addItem(user.userId, body);
  }

  @Patch('items/:itemId')
  update(@CurrentUser() user: any, @Param('itemId') itemId: string, @Body() body: { quantity: number }) {
    return this.service.updateItem(user.userId, itemId, body);
  }

  @Delete('items/:itemId')
  remove(@CurrentUser() user: any, @Param('itemId') itemId: string) {
    return this.service.removeItem(user.userId, itemId);
  }

  @Delete()
  clear(@CurrentUser() user: any) {
    return this.service.clearCart(user.userId);
  }

  @Get('count')
  count(@CurrentUser() user: any) {
    return this.service.getCartCount(user.userId);
  }
}


