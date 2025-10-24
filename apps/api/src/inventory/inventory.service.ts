import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async addLot(merchantId: string, data: { skuId: string; quantity: number; expiry?: string }) {
    // Ensure SKU exists and belongs to merchant via product->merchant relation
    const sku = await this.prisma.sku.findUnique({ where: { id: data.skuId }, include: { product: true } });
    if (!sku) throw new NotFoundException('SKU not found');
    if (sku.product.merchantId !== merchantId) throw new NotFoundException('SKU not owned by merchant');
    
    const lot = await this.prisma.inventoryLot.create({ 
      data: { 
        merchantId, 
        skuId: data.skuId, 
        quantity: data.quantity, 
        expiry: data.expiry ? new Date(data.expiry) : undefined 
      } 
    });

    // Record movement
    await this.recordMovement(merchantId, {
      skuId: data.skuId,
      type: 'addition',
      quantity: data.quantity,
      reason: 'New inventory lot added',
    });

    return lot;
  }

  async listForMerchant(merchantId: string) {
    return this.prisma.inventoryLot.findMany({ where: { merchantId }, include: { sku: true } });
  }

  async recordMovement(merchantId: string, data: CreateInventoryMovementDto, createdBy?: string) {
    // Verify SKU belongs to merchant
    const sku = await this.prisma.sku.findUnique({ 
      where: { id: data.skuId }, 
      include: { product: true } 
    });
    if (!sku) throw new NotFoundException('SKU not found');
    if (sku.product.merchantId !== merchantId) throw new NotFoundException('SKU not owned by merchant');

    // Record the movement
    const movement = await this.prisma.inventoryMovement.create({
      data: {
        merchantId,
        skuId: data.skuId,
        type: data.type,
        quantity: data.quantity,
        reason: data.reason,
        referenceId: data.referenceId,
        createdBy,
      },
    });

    // Update inventory lot if it's a removal/adjustment
    if (data.type === 'removal' || data.type === 'adjustment' || data.type === 'sale') {
      await this.updateInventoryLot(merchantId, data.skuId, data.quantity);
    }

    return movement;
  }

  async getMovements(merchantId: string, skuId?: string, limit = 50) {
    const whereClause: any = { merchantId };
    if (skuId) {
      whereClause.skuId = skuId;
    }

    return this.prisma.inventoryMovement.findMany({
      where: whereClause,
      include: {
        sku: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getInventoryAnalytics(merchantId: string) {
    // Get total inventory value
    const inventoryLots = await this.prisma.inventoryLot.findMany({
      where: { merchantId },
      include: {
        sku: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalValue = inventoryLots.reduce((sum, lot) => {
      return sum + (lot.quantity * lot.sku.pricePerCanonicalUnit);
    }, 0);

    // Get low stock items (less than 10 units)
    const lowStockItems = inventoryLots.filter(lot => lot.quantity < 10);

    // Get movements in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMovements = await this.prisma.inventoryMovement.findMany({
      where: {
        merchantId,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const movementsByType = recentMovements.reduce((acc, movement) => {
      acc[movement.type] = (acc[movement.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalValue: totalValue / 100, // Convert from cents to ETB
      totalItems: inventoryLots.length,
      lowStockItems: lowStockItems.length,
      lowStockAlerts: lowStockItems.map(lot => ({
        skuId: lot.skuId,
        skuName: lot.sku.name,
        currentQuantity: lot.quantity,
        productName: lot.sku.product.name,
      })),
      recentMovements: movementsByType,
      totalMovements: recentMovements.length,
    };
  }

  async getLowStockAlerts(merchantId: string, threshold = 10) {
    const lowStockLots = await this.prisma.inventoryLot.findMany({
      where: {
        merchantId,
        quantity: { lt: threshold },
      },
      include: {
        sku: {
          include: {
            product: true,
          },
        },
      },
    });

    return lowStockLots.map(lot => ({
      skuId: lot.skuId,
      skuName: lot.sku.name,
      productName: lot.sku.product.name,
      currentQuantity: lot.quantity,
      threshold,
      unitType: lot.sku.unitType,
    }));
  }

  private async updateInventoryLot(merchantId: string, skuId: string, quantityChange: number) {
    // Find the oldest lot for this SKU (FIFO)
    const lot = await this.prisma.inventoryLot.findFirst({
      where: {
        merchantId,
        skuId,
        quantity: { gt: 0 },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!lot) {
      throw new BadRequestException('Insufficient inventory');
    }

    const newQuantity = lot.quantity + quantityChange;
    
    if (newQuantity < 0) {
      throw new BadRequestException('Insufficient inventory');
    }

    if (newQuantity === 0) {
      // Remove the lot
      await this.prisma.inventoryLot.delete({ where: { id: lot.id } });
    } else {
      // Update the lot
      await this.prisma.inventoryLot.update({
        where: { id: lot.id },
        data: { quantity: newQuantity },
      });
    }
  }
}


