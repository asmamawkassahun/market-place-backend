import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateWishlistDto) {
    const shareToken = data.isPublic ? this.generateShareToken() : null;
    
    return this.prisma.wishlist.create({
      data: {
        ...data,
        userId,
        shareToken,
      },
      include: {
        items: {
          include: {
            product: true,
            sku: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            sku: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            sku: true,
          },
        },
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    if (wishlist.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return wishlist;
  }

  async findByShareToken(shareToken: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { shareToken },
      include: {
        items: {
          include: {
            product: true,
            sku: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return wishlist;
  }

  async update(id: string, userId: string, data: UpdateWishlistDto) {
    const wishlist = await this.findOne(id, userId);
    
    const updateData: any = { ...data };
    if (data.isPublic && !wishlist.shareToken) {
      updateData.shareToken = this.generateShareToken();
    } else if (!data.isPublic) {
      updateData.shareToken = null;
    }

    return this.prisma.wishlist.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
            sku: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.wishlist.delete({ where: { id } });
  }

  async addItem(wishlistId: string, userId: string, data: AddWishlistItemDto) {
    const wishlist = await this.findOne(wishlistId, userId);

    // Check if item already exists
    const existingItem = await this.prisma.wishlistItem.findFirst({
      where: {
        wishlistId,
        productId: data.productId,
        skuId: data.skuId || null,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      return this.prisma.wishlistItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: data.quantity || existingItem.quantity + 1,
          notes: data.notes || existingItem.notes,
        },
        include: {
          product: true,
          sku: true,
        },
      });
    }

    return this.prisma.wishlistItem.create({
      data: {
        wishlistId,
        ...data,
        quantity: data.quantity || 1,
      },
      include: {
        product: true,
        sku: true,
      },
    });
  }

  async removeItem(wishlistId: string, itemId: string, userId: string) {
    const wishlist = await this.findOne(wishlistId, userId);
    
    const item = await this.prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        wishlistId,
      },
    });

    if (!item) {
      throw new NotFoundException('Wishlist item not found');
    }

    return this.prisma.wishlistItem.delete({ where: { id: itemId } });
  }

  private generateShareToken(): string {
    return randomBytes(16).toString('hex');
  }
}
