import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, data: any) {
    console.log('=== MERCHANTS SERVICE CREATE ===');
    console.log('Owner ID:', ownerId);
    console.log('Data received:', JSON.stringify(data, null, 2));
    
    const exists = await this.prisma.merchant.findUnique({ where: { ownerId } });
    if (exists) {
      console.log('Merchant already exists for owner:', ownerId);
      throw new BadRequestException('Merchant already exists for this owner');
    }
    
    console.log('Creating merchant in database...');
    return this.prisma.$transaction(async (tx) => {
      const merchantData = { 
        ownerId, 
        displayName: data.displayName, 
        legalName: data.legalName, 
        description: data.description, 
        logoUrl: data.logoUrl || null,
        lat: data.lat || null, 
        lon: data.lon || null, 
        serviceAreas: data.serviceAreas ?? [] 
      };
      
      console.log('Merchant data for DB:', JSON.stringify(merchantData, null, 2));
      
      const merchant = await tx.merchant.create({ data: merchantData });
      console.log('Merchant created with ID:', merchant.id);
      
      await tx.user.update({ where: { id: ownerId }, data: { role: 'MERCHANT' as any } });
      console.log('User role updated to MERCHANT');
      
      console.log('=== MERCHANTS SERVICE SUCCESS ===');
      return merchant;
    });
  }

  async me(ownerId: string) {
    const m = await this.prisma.merchant.findUnique({ 
      where: { ownerId },
      include: {
        payout: true,
        kyc: true,
        owner: {
          select: {
            id: true,
            email: true,
            phone: true,
            name: true
          }
        }
      }
    });
    if (!m) throw new NotFoundException('Merchant not found');
    return m;
  }

  async update(ownerId: string, data: any) {
    const m = await this.prisma.merchant.findUnique({ where: { ownerId } });
    if (!m) throw new NotFoundException('Merchant not found');
    return this.prisma.merchant.update({ where: { ownerId }, data });
  }

  async nearby(lat: number, lon: number, radiusKm = 25) {
    // Simple Haversine filter in SQL approximated via computation on app side
    const all = await this.prisma.merchant.findMany({ where: { lat: { not: null }, lon: { not: null } } });
    const R = 6371; // km
    const toRad = (d: number) => (d * Math.PI) / 180;
    const within = all.filter((m) => {
      if (m.lat == null || m.lon == null) return false;
      const dLat = toRad((m.lat as number) - lat);
      const dLon = toRad((m.lon as number) - lon);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(m.lat as number)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d <= radiusKm;
    });
    return within;
  }

  async summary(ownerId: string) {
    const m = await this.prisma.merchant.findUnique({ where: { ownerId } });
    if (!m) throw new NotFoundException('Merchant not found');
    const totals = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { merchantId: m.id, status: { in: ['DELIVERED', 'SHIPPED', 'CONFIRMED'] as any } },
    });
    const items = await this.prisma.orderItem.count({ where: { order: { merchantId: m.id } } });
    return { totalSalesETB: (totals._sum.totalAmount ?? 0) / 100, itemsSold: items };
  }

  // New methods for the updated controller
  async getMerchants(params: any) {
    const { page, limit, search, isActive, isVerified, lat, lon, radius, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) where.displayName = { contains: search, mode: 'insensitive' };
    if (isActive !== undefined) where.owner = { role: isActive ? 'MERCHANT' : 'USER' };
    if (isVerified !== undefined) where.kyc = { status: isVerified ? 'APPROVED' : 'PENDING' };

    const [merchants, total] = await Promise.all([
      this.prisma.merchant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          owner: {
            select: { id: true, phone: true, name: true }
          },
          kyc: {
            select: { status: true }
          }
        }
      }),
      this.prisma.merchant.count({ where })
    ]);

    return {
      merchants,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async searchNearbyMerchants(lat: number, lon: number, radius: number) {
    return this.nearby(lat, lon, radius);
  }

  async getMerchant(id: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, phone: true, name: true }
        },
        kyc: {
          select: { status: true }
        }
      }
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }

  async getMerchantProducts(merchantId: string, params: any) {
    const { page, limit, category, search } = params;
    const skip = (page - 1) * limit;

    const where: any = { merchantId };
    if (category) where.categoryId = category;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          skus: true,
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

  async getMerchantOrders(merchantId: string, params: any) {
    const { page, limit, status } = params;
    const skip = (page - 1) * limit;

    const where: any = { merchantId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, phone: true, name: true }
          },
          items: {
            include: {
              sku: {
                include: {
                  product: {
                    select: { name: true }
                  }
                }
              }
            }
          }
        }
      }),
      this.prisma.order.count({ where })
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getMerchantSummary(merchantId: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId }
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    const totals = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { merchantId, status: { in: ['DELIVERED', 'SHIPPED', 'CONFIRMED'] as any } },
    });

    const items = await this.prisma.orderItem.count({ 
      where: { order: { merchantId } } 
    });

    const productCount = await this.prisma.product.count({
      where: { merchantId }
    });

    return { 
      totalSalesETB: (totals._sum.totalAmount ?? 0) / 100, 
      itemsSold: items,
      productCount,
      rating: merchant.rating
    };
  }

  async getCurrentMerchant(ownerId: string) {
    return this.me(ownerId);
  }

  async createMerchant(ownerId: string, data: any) {
    return this.create(ownerId, data);
  }

  async updateMerchant(ownerId: string, id: string, data: any) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id }
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    if (merchant.ownerId !== ownerId) {
      throw new BadRequestException('You can only update your own merchant profile');
    }

    // Handle payout update separately
    const { payout, ...merchantData } = data;

    return this.prisma.$transaction(async (tx) => {
      // Update merchant
      const updatedMerchant = await tx.merchant.update({
        where: { id },
        data: merchantData
      });

      // Update or create payout if provided
      if (payout && payout.method && payout.accountRef) {
        const existingPayout = await tx.merchantPayout.findUnique({
          where: { merchantId: id }
        });

        if (existingPayout) {
          await tx.merchantPayout.update({
            where: { merchantId: id },
            data: {
              method: payout.method,
              accountRef: payout.accountRef
            }
          });
        } else {
          await tx.merchantPayout.create({
            data: {
              merchantId: id,
              method: payout.method,
              accountRef: payout.accountRef
            }
          });
        }
      }

      return updatedMerchant;
    });
  }

  async deleteMerchant(ownerId: string, id: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id }
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    if (merchant.ownerId !== ownerId) {
      throw new BadRequestException('You can only delete your own merchant profile');
    }

    return this.prisma.merchant.delete({ where: { id } });
  }

  async approveMerchant(ownerId: string, id: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: { kyc: true }
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    if (!merchant.kyc) {
      throw new BadRequestException('Merchant KYC not found');
    }

    return this.prisma.merchantKyc.update({
      where: { merchantId: id },
      data: { status: 'APPROVED' }
    });
  }

  async rejectMerchant(ownerId: string, id: string, reason?: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: { kyc: true }
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    if (!merchant.kyc) {
      throw new BadRequestException('Merchant KYC not found');
    }

    return this.prisma.merchantKyc.update({
      where: { merchantId: id },
      data: { 
        status: 'REJECTED',
        notes: reason || 'Rejected by admin'
      }
    });
  }
}


