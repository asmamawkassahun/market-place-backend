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
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.create(user.userId, createWishlistDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.wishlistService.findAll(user.userId);
  }

  @Get('public/:shareToken')
  findByShareToken(@Param('shareToken') shareToken: string) {
    return this.wishlistService.findByShareToken(shareToken);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.wishlistService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistService.update(id, user.userId, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.wishlistService.remove(id, user.userId);
  }

  @Post(':id/items')
  addItem(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() addWishlistItemDto: AddWishlistItemDto,
  ) {
    return this.wishlistService.addItem(id, user.userId, addWishlistItemDto);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user: any,
  ) {
    return this.wishlistService.removeItem(id, itemId, user.userId);
  }
}
