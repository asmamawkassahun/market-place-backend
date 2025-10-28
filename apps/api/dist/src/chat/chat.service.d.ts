import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ChatService {
    private prisma;
    private notify;
    constructor(prisma: PrismaService, notify: NotificationsService);
    getOrCreateConversation(userId: string, merchantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        userId: string;
    }>;
    listMessages(conversationId: string): Promise<{
        id: string;
        createdAt: Date;
        attachments: string[];
        type: import("@prisma/client").$Enums.MessageType;
        readAt: Date | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        conversationId: string;
        senderUserId: string | null;
        senderMerchantId: string | null;
        senderRole: import("@prisma/client").$Enums.SenderRole;
        content: string | null;
    }[]>;
    sendText(conversationId: string, senderRole: 'BUYER' | 'MERCHANT', senderId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        attachments: string[];
        type: import("@prisma/client").$Enums.MessageType;
        readAt: Date | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        conversationId: string;
        senderUserId: string | null;
        senderMerchantId: string | null;
        senderRole: import("@prisma/client").$Enums.SenderRole;
        content: string | null;
    }>;
    sendSignal(conversationId: string, senderRole: 'BUYER' | 'MERCHANT', senderId: string, payload: any): Promise<{
        id: string;
        createdAt: Date;
        attachments: string[];
        type: import("@prisma/client").$Enums.MessageType;
        readAt: Date | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        conversationId: string;
        senderUserId: string | null;
        senderMerchantId: string | null;
        senderRole: import("@prisma/client").$Enums.SenderRole;
        content: string | null;
    }>;
    markRead(conversationId: string, latestMessageId: string): Promise<{
        ok: boolean;
    }>;
    reportMessage(userId: string, messageId: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        messageId: string;
        status: import("@prisma/client").$Enums.ReportStatus;
        reason: string;
        resolvedAt: Date | null;
        reporterId: string;
    }>;
    listReports(): Promise<({
        message: {
            id: string;
            createdAt: Date;
            attachments: string[];
            type: import("@prisma/client").$Enums.MessageType;
            readAt: Date | null;
            payload: import("@prisma/client/runtime/library").JsonValue | null;
            conversationId: string;
            senderUserId: string | null;
            senderMerchantId: string | null;
            senderRole: import("@prisma/client").$Enums.SenderRole;
            content: string | null;
        };
        reporter: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        messageId: string;
        status: import("@prisma/client").$Enums.ReportStatus;
        reason: string;
        resolvedAt: Date | null;
        reporterId: string;
    })[]>;
    resolveReport(reportId: string): Promise<{
        id: string;
        createdAt: Date;
        messageId: string;
        status: import("@prisma/client").$Enums.ReportStatus;
        reason: string;
        resolvedAt: Date | null;
        reporterId: string;
    }>;
    searchMessages(conversationId: string, q: string): Promise<{
        id: string;
        createdAt: Date;
        attachments: string[];
        type: import("@prisma/client").$Enums.MessageType;
        readAt: Date | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        conversationId: string;
        senderUserId: string | null;
        senderMerchantId: string | null;
        senderRole: import("@prisma/client").$Enums.SenderRole;
        content: string | null;
    }[]>;
    sendAttachments(conversationId: string, senderRole: 'BUYER' | 'MERCHANT', senderId: string, attachments: string[]): Promise<{
        id: string;
        createdAt: Date;
        attachments: string[];
        type: import("@prisma/client").$Enums.MessageType;
        readAt: Date | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        conversationId: string;
        senderUserId: string | null;
        senderMerchantId: string | null;
        senderRole: import("@prisma/client").$Enums.SenderRole;
        content: string | null;
    }>;
    createInvite(conversationId: string, creatorUserId: string, ttlMinutes?: number): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        expiresAt: Date;
        conversationId: string;
        createdByUserId: string;
    }>;
    redeemInvite(token: string, userId: string): Promise<{
        conversationId: string;
    }>;
}
