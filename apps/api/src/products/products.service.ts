import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface GetProductsParams {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  merchantId?: string;
  isActive?: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  unitType?: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getMerchantByOwnerId(ownerId: string) {
    console.log('[ProductsService] Looking up merchant for ownerId:', ownerId);
    const merchant = await this.prisma.merchant.findUnique({
      where: { ownerId },
      select: { id: true, ownerId: true, displayName: true }
    });
    console.log('[ProductsService] Merchant lookup result:', merchant ? { id: merchant.id, displayName: merchant.displayName } : 'NOT FOUND');
    return merchant;
  }

  async getProducts(params: GetProductsParams) {
    const { page, limit, category, search, merchantId, isActive, sortBy, sortOrder, minPrice, maxPrice, unitType } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) where.categoryId = category;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (merchantId) where.merchantId = merchantId;
    if (isActive !== undefined) where.isActive = isActive;

    // Filter by SKU properties (price and unitType)
    // Always filter for active SKUs, and add additional filters if provided
    const skuWhere: any = { active: true };
    if (unitType) skuWhere.unitType = unitType;
    if (minPrice !== undefined || maxPrice !== undefined) {
      // Convert ETB to cents (pricePerCanonicalUnit is stored in cents)
      const minPriceCents = minPrice !== undefined ? Math.round(minPrice * 100) : undefined;
      const maxPriceCents = maxPrice !== undefined ? Math.round(maxPrice * 100) : undefined;
      
      if (minPriceCents !== undefined && maxPriceCents !== undefined) {
        skuWhere.pricePerCanonicalUnit = { gte: minPriceCents, lte: maxPriceCents };
      } else if (minPriceCents !== undefined) {
        skuWhere.pricePerCanonicalUnit = { gte: minPriceCents };
      } else if (maxPriceCents !== undefined) {
        skuWhere.pricePerCanonicalUnit = { lte: maxPriceCents };
      }
    }

    // Always filter products to only show those with active SKUs
    // If we have additional filters (unitType or price), apply those too
    where.skus = {
      some: skuWhere
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          skus: {
            where: skuWhere
          },
          merchant: {
            select: { id: true, displayName: true, rating: true }
          },
          category: {
            select: { id: true, name: true }
          }
        }
      }),
      this.prisma.product.count({ where })
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async searchProducts(query: string, params: Omit<GetProductsParams, 'search'>) {
    return this.getProducts({ ...params, search: query });
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        skus: true,
        merchant: {
          select: { id: true, displayName: true, rating: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getProductSkus(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.sku.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' }
    });
  }

  async getProductReviews(productId: string, params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, phone: true }
          }
        }
      }),
      this.prisma.review.count({ where: { productId } })
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getProductQnA(productId: string, params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [qnas, total] = await Promise.all([
      this.prisma.qna.findMany({
        where: { productId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, phone: true }
          }
        }
      }),
      this.prisma.qna.count({ where: { productId } })
    ]);

    return {
      qnas,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async createProduct(ownerUserId: string, data: { name: string; slug: string; categoryId?: string; description?: string; images?: string[]; skus?: any[] }) {
    console.log('=== PRODUCT CREATION START ===');
    console.log('Owner User ID:', ownerUserId);
    console.log('Product data received:', JSON.stringify(data, null, 2));
    
    // Resolve the merchant by the current user's ownership to satisfy FK constraint
    const merchant = await this.prisma.merchant.findUnique({ where: { ownerId: ownerUserId } });
    if (!merchant) {
      console.log('Merchant not found for user:', ownerUserId);
      throw new NotFoundException('Merchant not found for current user');
    }
    console.log('Found merchant:', merchant.id);
    
    // Extract SKUs from data if present
    const { skus, ...productData } = data;
    console.log('SKUs to create:', skus);
    
    // Create product and SKUs in a transaction
    return this.prisma.$transaction(async (tx) => {
      console.log('Creating product...');
      const product = await tx.product.create({ 
        data: { 
          merchantId: merchant.id, 
          ...productData,
          images: productData.images || []
        } 
      });
      console.log('Product created with ID:', product.id);
      
      // Create SKUs if provided
      if (skus && skus.length > 0) {
        console.log('Creating SKUs...');
        await Promise.all(
          skus.map(async (sku, index) => {
            console.log(`Creating SKU ${index}:`, sku);
            const skuData = {
              productId: product.id,
              name: sku.name || 'Default',
              unitType: sku.unitType || 'PIECE',
              unitIncrement: sku.unitIncrement || 1,
              packageSize: sku.packageSize || null,
              pricePerCanonicalUnit: Math.round(sku.pricePerCanonicalUnit || 0),
              currency: sku.currency || 'ETB',
              active: sku.active !== undefined ? sku.active : true,
            };
            console.log(`SKU ${index} data:`, skuData);
            return tx.sku.create({ data: skuData });
          })
        );
        console.log('All SKUs created successfully');
      }
      
      // Return product with SKUs
      const result = await tx.product.findUnique({
        where: { id: product.id },
        include: { skus: true }
      });
      console.log('=== PRODUCT CREATION SUCCESS ===');
      return result;
    });
  }

  async updateProduct(ownerUserId: string, productId: string, data: any) {
    try {
      console.log('=== PRODUCT UPDATE START ===');
      console.log('Owner User ID:', ownerUserId);
      console.log('Product ID:', productId);
      console.log('Update data received:', JSON.stringify(data, null, 2));

      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: { merchant: true, skus: true }
      });

      if (!product) {
        console.log('Product not found');
        throw new NotFoundException('Product not found');
      }

      if (product.merchant.ownerId !== ownerUserId) {
        console.log('Forbidden: User does not own this product');
        throw new ForbiddenException('You can only update your own products');
      }

      // Extract SKUs from data if present
      const { skus, ...productData } = data;
      
      // Only allow specific product fields to be updated
      const allowedFields = ['name', 'slug', 'description', 'categoryId', 'images'];
      const filteredProductData: any = {};
      for (const key of allowedFields) {
        if (productData[key] !== undefined) {
          filteredProductData[key] = productData[key];
        }
      }

      console.log('Filtered product data:', JSON.stringify(filteredProductData, null, 2));
      console.log('SKUs to process:', skus?.length || 0);

      // Update product and SKUs in a transaction
      return await this.prisma.$transaction(async (tx) => {
        // Update product fields (excluding SKUs)
        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: filteredProductData
        });

      // Handle SKU updates if provided
      if (skus && Array.isArray(skus)) {
        // Get existing SKU IDs
        const existingSkuIds = new Set(product.skus.map(sku => sku.id));
        const incomingSkuIds = new Set(
          skus
            .filter((sku: any) => sku.id)
            .map((sku: any) => sku.id)
        );

        // Delete SKUs that were removed (exist in DB but not in incoming data)
        const skusToDelete = product.skus.filter(
          sku => !incomingSkuIds.has(sku.id)
        );
        if (skusToDelete.length > 0) {
          await tx.sku.deleteMany({
            where: {
              id: { in: skusToDelete.map(s => s.id) }
            }
          });
        }

        // Update or create SKUs
        await Promise.all(
          skus.map(async (sku: any) => {
            const skuData = {
              name: sku.name || 'Default',
              unitType: sku.unitType || 'PIECE',
              unitIncrement: sku.unitIncrement || 1,
              packageSize: sku.packageSize || null,
              pricePerCanonicalUnit: Math.round(sku.pricePerCanonicalUnit || 0),
              currency: sku.currency || 'ETB',
              active: sku.active !== undefined ? sku.active : true,
            };

            if (sku.id && existingSkuIds.has(sku.id)) {
              // Update existing SKU
              return tx.sku.update({
                where: { id: sku.id },
                data: skuData
              });
            } else {
              // Create new SKU
              return tx.sku.create({
                data: {
                  ...skuData,
                  productId: productId
                }
              });
            }
          })
        );
      }

        // Return updated product with SKUs
        const result = await tx.product.findUnique({
          where: { id: productId },
          include: { 
            skus: true,
            merchant: {
              select: { id: true, displayName: true }
            },
            category: {
              select: { id: true, name: true }
            }
          }
        });
        
        console.log('=== PRODUCT UPDATE SUCCESS ===');
        return result;
      });
    } catch (error: any) {
      console.error('=== PRODUCT UPDATE ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async deleteProduct(ownerUserId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { merchant: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.merchant.ownerId !== ownerUserId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    return this.prisma.product.delete({ where: { id: productId } });
  }

  async createProductSku(ownerUserId: string, productId: string, data: { name: string; unitType: 'PIECE'|'KG'|'LITER'|'METER'; unitIncrement: number; packageSize?: number; pricePerCanonicalUnit: number }) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { merchant: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.merchant.ownerId !== ownerUserId) {
      throw new ForbiddenException('You can only add SKUs to your own products');
    }

    return this.prisma.sku.create({ data: { productId, ...data } });
  }

  async updateProductSku(ownerUserId: string, productId: string, skuId: string, data: any) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { merchant: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.merchant.ownerId !== ownerUserId) {
      throw new ForbiddenException('You can only update SKUs of your own products');
    }

    const sku = await this.prisma.sku.findUnique({
      where: { id: skuId }
    });

    if (!sku || sku.productId !== productId) {
      throw new NotFoundException('SKU not found');
    }

    return this.prisma.sku.update({
      where: { id: skuId },
      data
    });
  }

  async deleteProductSku(ownerUserId: string, productId: string, skuId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { merchant: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.merchant.ownerId !== ownerUserId) {
      throw new ForbiddenException('You can only delete SKUs of your own products');
    }

    const sku = await this.prisma.sku.findUnique({
      where: { id: skuId }
    });

    if (!sku || sku.productId !== productId) {
      throw new NotFoundException('SKU not found');
    }

    return this.prisma.sku.delete({ where: { id: skuId } });
  }

  // Legacy methods for backward compatibility
  async create(ownerUserId: string, data: { name: string; slug: string; categoryId?: string; description?: string; images?: string[] }) {
    return this.createProduct(ownerUserId, data);
  }

  async addSku(productId: string, data: { name: string; unitType: 'PIECE'|'KG'|'LITER'|'METER'; unitIncrement: number; packageSize?: number; pricePerCanonicalUnit: number }) {
    return this.prisma.sku.create({ data: { productId, ...data } });
  }

  async findOne(id: string) {
    return this.getProduct(id);
  }

  async search(q?: string) {
    const result = await this.getProducts({
      page: 1,
      limit: 50,
      search: q,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    return result.products;
  }
}


