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
import { GiftRegistryService } from './gift-registry.service';
import { CreateGiftRegistryDto } from './dto/create-gift-registry.dto';
import { UpdateGiftRegistryDto } from './dto/update-gift-registry.dto';
import { AddGiftRegistryItemDto } from './dto/add-gift-registry-item.dto';
import { MarkPurchasedDto } from './dto/mark-purchased.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('gift-registry')
export class GiftRegistryController {
  constructor(private readonly giftRegistryService: GiftRegistryService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createGiftRegistryDto: CreateGiftRegistryDto) {
    return this.giftRegistryService.create(user.userId, createGiftRegistryDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.giftRegistryService.findAll(user.userId);
  }

  @Get('public/:shareToken')
  findByShareToken(@Param('shareToken') shareToken: string) {
    return this.giftRegistryService.findByShareToken(shareToken);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.giftRegistryService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateGiftRegistryDto: UpdateGiftRegistryDto,
  ) {
    return this.giftRegistryService.update(id, user.userId, updateGiftRegistryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.giftRegistryService.remove(id, user.userId);
  }

  @Post(':id/items')
  addItem(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() addGiftRegistryItemDto: AddGiftRegistryItemDto,
  ) {
    return this.giftRegistryService.addItem(id, user.userId, addGiftRegistryItemDto);
  }

  @Patch(':id/items/:itemId/purchased')
  markPurchased(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() markPurchasedDto: MarkPurchasedDto,
  ) {
    return this.giftRegistryService.markPurchased(id, itemId, markPurchasedDto);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user: any,
  ) {
    return this.giftRegistryService.removeItem(id, itemId, user.userId);
  }
}
