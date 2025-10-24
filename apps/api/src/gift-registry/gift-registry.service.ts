import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGiftRegistryDto } from './dto/create-gift-registry.dto';
import { UpdateGiftRegistryDto } from './dto/update-gift-registry.dto';
import { AddGiftRegistryItemDto } from './dto/add-gift-registry-item.dto';
import { MarkPurchasedDto } from './dto/mark-purchased.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class GiftRegistryService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateGiftRegistryDto) {
    const shareToken = data.isPublic ? this.generateShareToken() : null;
    
    return this.prisma.giftRegistry.create({
      data: {
        ...data,
        userId,
        shareToken,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
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
    return this.prisma.giftRegistry.findMany({
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
    const registry = await this.prisma.giftRegistry.findUnique({
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

    if (!registry) {
      throw new NotFoundException('Gift registry not found');
    }

    if (registry.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return registry;
  }

  async findByShareToken(shareToken: string) {
    const registry = await this.prisma.giftRegistry.findUnique({
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

    if (!registry) {
      throw new NotFoundException('Gift registry not found');
    }

    return registry;
  }

  async update(id: string, userId: string, data: UpdateGiftRegistryDto) {
    const registry = await this.findOne(id, userId);
    
    const updateData: any = { ...data };
    if (data.eventDate) {
      updateData.eventDate = new Date(data.eventDate);
    }
    if (data.isPublic && !registry.shareToken) {
      updateData.shareToken = this.generateShareToken();
    } else if (data.isPublic === false) {
      updateData.shareToken = null;
    }

    return this.prisma.giftRegistry.update({
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
    return this.prisma.giftRegistry.delete({ where: { id } });
  }

  async addItem(registryId: string, userId: string, data: AddGiftRegistryItemDto) {
    const registry = await this.findOne(registryId, userId);

    // Check if item already exists
    const existingItem = await this.prisma.giftRegistryItem.findFirst({
      where: {
        registryId,
        productId: data.productId,
        skuId: data.skuId || null,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      return this.prisma.giftRegistryItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: data.quantity,
          notes: data.notes || existingItem.notes,
          priority: data.priority || existingItem.priority,
        },
        include: {
          product: true,
          sku: true,
        },
      });
    }

    return this.prisma.giftRegistryItem.create({
      data: {
        registryId,
        ...data,
        priority: data.priority || 'medium',
      },
      include: {
        product: true,
        sku: true,
      },
    });
  }

  async markPurchased(registryId: string, itemId: string, data: MarkPurchasedDto) {
    const registry = await this.prisma.giftRegistry.findUnique({
      where: { id: registryId },
    });

    if (!registry) {
      throw new NotFoundException('Gift registry not found');
    }

    const item = await this.prisma.giftRegistryItem.findFirst({
      where: {
        id: itemId,
        registryId,
      },
    });

    if (!item) {
      throw new NotFoundException('Gift registry item not found');
    }

    const quantityPurchased = data.quantityPurchased || item.quantity;
    const newQuantityPurchased = item.quantityPurchased + quantityPurchased;
    const isFullyPurchased = newQuantityPurchased >= item.quantity;

    return this.prisma.giftRegistryItem.update({
      where: { id: itemId },
      data: {
        quantityPurchased: newQuantityPurchased,
        isPurchased: isFullyPurchased,
        purchasedBy: data.purchasedBy,
        purchasedAt: isFullyPurchased ? new Date() : null,
      },
      include: {
        product: true,
        sku: true,
      },
    });
  }

  async removeItem(registryId: string, itemId: string, userId: string) {
    const registry = await this.findOne(registryId, userId);
    
    const item = await this.prisma.giftRegistryItem.findFirst({
      where: {
        id: itemId,
        registryId,
      },
    });

    if (!item) {
      throw new NotFoundException('Gift registry item not found');
    }

    return this.prisma.giftRegistryItem.delete({ where: { id: itemId } });
  }

  private generateShareToken(): string {
    return randomBytes(16).toString('hex');
  }
}
