import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateSkuDto } from './dto/create-sku.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  async getProducts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('merchantId') merchantId?: string,
    @Query('isActive') isActive?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.service.getProducts({
      page: page || 1,
      limit: limit || 10,
      category,
      search,
      merchantId,
      isActive,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc'
    });
  }

  @Get('search')
  async searchProducts(
    @Query('q') q: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('merchantId') merchantId?: string,
    @Query('isActive') isActive?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.service.searchProducts(q, {
      page: page || 1,
      limit: limit || 10,
      category,
      merchantId,
      isActive,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc'
    });
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.service.getProduct(id);
  }

  @Get(':id/skus')
  async getProductSkus(@Param('id') productId: string) {
    return this.service.getProductSkus(productId);
  }

  @Get(':id/reviews')
  async getProductReviews(
    @Param('id') productId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.service.getProductReviews(productId, {
      page: page || 1,
      limit: limit || 10
    });
  }

  @Get(':id/qna')
  async getProductQnA(
    @Param('id') productId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.service.getProductQnA(productId, {
      page: page || 1,
      limit: limit || 10
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(@CurrentUser() user: any, @Body() body: CreateProductDto) {
    return this.service.createProduct(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateProduct(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.service.updateProduct(user.userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProduct(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.deleteProduct(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':productId/skus')
  async createProductSku(@CurrentUser() user: any, @Param('productId') productId: string, @Body() body: CreateSkuDto) {
    return this.service.createProductSku(user.userId, productId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':productId/skus/:skuId')
  async updateProductSku(@CurrentUser() user: any, @Param('productId') productId: string, @Param('skuId') skuId: string, @Body() body: any) {
    return this.service.updateProductSku(user.userId, productId, skuId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId/skus/:skuId')
  async deleteProductSku(@CurrentUser() user: any, @Param('productId') productId: string, @Param('skuId') skuId: string) {
    return this.service.deleteProductSku(user.userId, productId, skuId);
  }
}


