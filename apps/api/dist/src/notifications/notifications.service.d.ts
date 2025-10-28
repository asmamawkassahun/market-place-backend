import { PrismaService } from '../prisma/prisma.service';
export interface GetNotificationsParams {
    page: number;
    limit: number;
    type?: string;
    read?: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getNotifications(userId: string, params: GetNotificationsParams): Promise<{
        notifications: ({
            user: {
                id: string;
                name: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            message: string;
            userId: string;
            type: string;
            read: boolean;
            title: string;
            readAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        unreadCount: number;
    }>;
    getNotification(userId: string, id: string): Promise<{
        user: {
            id: string;
            name: string | null;
            phone: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        userId: string;
        type: string;
        read: boolean;
        title: string;
        readAt: Date | null;
    }>;
    markAsRead(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        userId: string;
        type: string;
        read: boolean;
        title: string;
        readAt: Date | null;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteNotification(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        userId: string;
        type: string;
        read: boolean;
        title: string;
        readAt: Date | null;
    }>;
    clearAllNotifications(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    updatePreferences(userId: string, preferences: any): Promise<{
        userId: string;
        preferences: any;
    }>;
    getPreferences(userId: string): Promise<{
        userId: string;
        preferences: {
            email: boolean;
            sms: boolean;
            push: boolean;
            priceAlerts: boolean;
            stockNotifications: boolean;
            orderUpdates: boolean;
            promotions: boolean;
        };
    }>;
    sms(to: string, text: string): Promise<{
        to: string;
        text: string;
    }>;
    email(to: string, subject: string, html: string): Promise<{
        to: string;
        subject: string;
    }>;
    push(to: string, title: string, body: string): Promise<{
        to: string;
        title: string;
        body: string;
    }>;
}
