import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, NotFoundException } from '@nestjs/common';
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

  // CRITICAL: This route MUST be registered before @Get(':id') to prevent 'me' from being treated as an id parameter
  // NestJS matches routes in the order they are defined, so specific routes must come before parameterized routes
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProducts(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean
  ) {
    console.log('[ProductsController] ✅ ROUTE MATCHED: /products/me');
    console.log('[ProductsController] getMyProducts called - userId:', user?.userId, 'role:', user?.role);
    
    // Get merchant ID for the authenticated merchant user
    const merchant = await this.service.getMerchantByOwnerId(user.userId);
    console.log('[ProductsController] Merchant lookup result:', merchant ? { id: merchant.id } : 'NOT FOUND');
    
    if (!merchant) {
      console.error('[ProductsController] ❌ Merchant not found for userId:', user.userId);
      throw new NotFoundException('Merchant not found for this user. Please ensure you have a merchant account.');
    }
    
    const result = await this.service.getProducts({
      page: page || 1,
      limit: limit || 10,
      category,
      search,
      merchantId: merchant.id,
      isActive,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    
    console.log('[ProductsController] ✅ Returning products:', {
      count: result.products?.length || 0,
      total: result.total,
      page: result.page
    });
    
    return result;
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    console.log('[ProductsController] getProduct called with id:', id);
    // CRITICAL: Prevent 'me' from matching this route - this should never happen if routes are registered correctly
    if (id === 'me') {
      console.error('[ProductsController] ❌ CRITICAL ERROR: /products/me matched @Get(:id) route instead of @Get(me)!');
      console.error('[ProductsController] This means the route registration order is wrong. The @Get(me) route must be registered before @Get(:id).');
      throw new NotFoundException({
        message: 'Route registration error: /products/me should match @Get(me) but matched @Get(:id). Please restart the backend server to fix route registration order.',
        error: 'Route Registration Error',
        statusCode: 404
      });
    }
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


