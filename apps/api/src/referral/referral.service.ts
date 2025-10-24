import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { CreateReferralCodeDto } from './dto/create-referral-code.dto';
import { UseReferralCodeDto } from './dto/use-referral-code.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class ReferralService {
  constructor(
    private prisma: PrismaService,
    private loyaltyService: LoyaltyService,
  ) {}

  async getOrCreateReferralCode(userId: string) {
    let referralCode = await this.prisma.referralCode.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (!referralCode) {
      // Create default referral code
      referralCode = await this.create(userId, {
        code: this.generateReferralCode(),
        rewardType: 'points',
        rewardValue: 100, // 100 points for referrer
      });
    }

    return referralCode;
  }

  async create(userId: string, data: CreateReferralCodeDto) {
    const code = data.code || this.generateReferralCode();
    
    // Check if code already exists
    const existing = await this.prisma.referralCode.findUnique({
      where: { code },
    });

    if (existing) {
      throw new BadRequestException('Referral code already exists');
    }

    return this.prisma.referralCode.create({
      data: {
        ...data,
        userId,
        code,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.referralCode.findMany({
      where: { userId },
      include: {
        transactions: {
          include: {
            referee: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const code = await this.prisma.referralCode.findUnique({
      where: { id },
      include: {
        transactions: {
          include: {
            referee: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!code) {
      throw new NotFoundException('Referral code not found');
    }

    if (code.userId !== userId) {
      throw new NotFoundException('Referral code not found');
    }

    return code;
  }

  async useReferralCode(refereeId: string, data: UseReferralCodeDto) {
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code: data.code },
    });

    if (!referralCode) {
      throw new NotFoundException('Invalid referral code');
    }

    if (!referralCode.isActive) {
      throw new BadRequestException('Referral code is not active');
    }

    if (referralCode.userId === refereeId) {
      throw new BadRequestException('Cannot use your own referral code');
    }

    if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
      throw new BadRequestException('Referral code has expired');
    }

    if (referralCode.maxUses && referralCode.currentUses >= referralCode.maxUses) {
      throw new BadRequestException('Referral code usage limit reached');
    }

    // Check if this referee has already used this code
    const existingTransaction = await this.prisma.referralTransaction.findFirst({
      where: {
        codeId: referralCode.id,
        refereeId,
      },
    });

    if (existingTransaction) {
      throw new BadRequestException('You have already used this referral code');
    }

    // Create referral transaction
    const transaction = await this.prisma.referralTransaction.create({
      data: {
        codeId: referralCode.id,
        referrerId: referralCode.userId,
        refereeId,
        orderId: data.orderId,
        rewardAmount: referralCode.rewardValue || 100,
        status: 'pending',
      },
    });

    // Update referral code usage count
    await this.prisma.referralCode.update({
      where: { id: referralCode.id },
      data: {
        currentUses: referralCode.currentUses + 1,
      },
    });

    return transaction;
  }

  async awardReferralRewards(orderId: string) {
    // Find pending referral transactions for this order
    const transactions = await this.prisma.referralTransaction.findMany({
      where: {
        orderId,
        status: 'pending',
      },
      include: {
        code: true,
      },
    });

    for (const transaction of transactions) {
      try {
        // Award points to referrer
        await this.loyaltyService.awardForOrder(
          transaction.referrerId,
          orderId,
          transaction.rewardAmount * 100, // Convert to cents
        );

        // Award points to referee (first-time bonus)
        await this.loyaltyService.awardForOrder(
          transaction.refereeId,
          orderId,
          transaction.rewardAmount * 50, // Half the referrer reward
        );

        // Update transaction status
        await this.prisma.referralTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'awarded',
            awardedAt: new Date(),
          },
        });
      } catch (error) {
        console.error('Error awarding referral rewards:', error);
        // Mark as expired if there's an error
        await this.prisma.referralTransaction.update({
          where: { id: transaction.id },
          data: { status: 'expired' },
        });
      }
    }
  }

  async getReferralStats(userId: string) {
    const codes = await this.prisma.referralCode.findMany({
      where: { userId },
      include: {
        transactions: true,
      },
    });

    const totalCodes = codes.length;
    const totalUses = codes.reduce((sum, code) => sum + code.currentUses, 0);
    const totalRewards = codes.reduce((sum, code) => 
      sum + code.transactions.filter(t => t.status === 'awarded').length * (code.rewardValue || 0), 0
    );

    return {
      totalCodes,
      totalUses,
      totalRewards,
      codes: codes.map(code => ({
        id: code.id,
        code: code.code,
        currentUses: code.currentUses,
        maxUses: code.maxUses,
        isActive: code.isActive,
        createdAt: code.createdAt,
      })),
    };
  }

  async getReferralTransactions(userId: string) {
    return this.prisma.referralTransaction.findMany({
      where: {
        OR: [
          { referrerId: userId },
          { refereeId: userId },
        ],
      },
      include: {
        code: {
          select: {
            code: true,
          },
        },
        referrer: {
          select: {
            name: true,
            phone: true,
          },
        },
        referee: {
          select: {
            name: true,
            phone: true,
          },
        },
        order: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private generateReferralCode(): string {
    return randomBytes(8).toString('hex').toUpperCase();
  }
}
