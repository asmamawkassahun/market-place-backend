import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(user: any, page?: number, limit?: number, type?: string, read?: boolean, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
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
    getNotification(user: any, id: string): Promise<{
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
    markAsRead(user: any, id: string): Promise<{
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
    markAllAsRead(user: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteNotification(user: any, id: string): Promise<{
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
    clearAllNotifications(user: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getUnreadCount(user: any): Promise<{
        count: number;
    }>;
    updatePreferences(user: any, preferences: any): Promise<{
        userId: string;
        preferences: any;
    }>;
    getPreferences(user: any): Promise<{
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
}
