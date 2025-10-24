import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface GetNotificationsParams {
  page: number;
  limit: number;
  type?: string;
  read?: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string, params: GetNotificationsParams) {
    const { page, limit, type, read, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (type) where.type = type;
    if (read !== undefined) where.read = read;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: { id: true, phone: true, name: true }
          }
        }
      }),
      this.prisma.notification.count({ where })
    ]);

    const unreadCount = await this.prisma.notification.count({
      where: { userId, read: false }
    });

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount
    };
  }

  async getNotification(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: { id: true, phone: true, name: true }
        }
      }
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() }
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() }
    });
  }

  async deleteNotification(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.delete({ where: { id } });
  }

  async clearAllNotifications(userId: string) {
    return this.prisma.notification.deleteMany({ where: { userId } });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false }
    });

    return { count };
  }

  async updatePreferences(userId: string, preferences: any) {
    // For now, just return the preferences as-is
    // In a real implementation, you'd store these in a user preferences table
    return { userId, preferences };
  }

  async getPreferences(userId: string) {
    // For now, return default preferences
    // In a real implementation, you'd fetch from a user preferences table
    return {
      userId,
      preferences: {
        email: true,
        sms: true,
        push: true,
        priceAlerts: true,
        stockNotifications: true,
        orderUpdates: true,
        promotions: true
      }
    };
  }

  // Legacy methods for backward compatibility
  async sms(to: string, text: string) { return { to, text }; }
  async email(to: string, subject: string, html: string) { return { to, subject }; }
  async push(to: string, title: string, body: string) { return { to, title, body }; }
}


