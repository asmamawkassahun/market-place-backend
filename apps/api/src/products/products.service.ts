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
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(params: GetProductsParams) {
    const { page, limit, category, search, merchantId, isActive, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) where.categoryId = category;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (merchantId) where.merchantId = merchantId;
    if (isActive !== undefined) where.isActive = isActive;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          skus: true,
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

  async createProduct(ownerUserId: string, data: { name: string; slug: string; categoryId?: string; description?: string; images?: string[] }) {
    // Resolve the merchant by the current user's ownership to satisfy FK constraint
    const merchant = await this.prisma.merchant.findUnique({ where: { ownerId: ownerUserId } });
    if (!merchant) throw new NotFoundException('Merchant not found for current user');
    return this.prisma.product.create({ data: { merchantId: merchant.id, ...data } });
  }

  async updateProduct(ownerUserId: string, productId: string, data: any) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { merchant: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.merchant.ownerId !== ownerUserId) {
      throw new ForbiddenException('You can only update your own products');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data
    });
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


