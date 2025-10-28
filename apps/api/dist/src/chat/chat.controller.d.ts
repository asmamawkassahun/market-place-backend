import { ChatService } from './chat.service';
import { StorageService } from '../storage/storage.service';
export declare class ChatController {
    private readonly service;
    private storage;
    constructor(service: ChatService, storage: StorageService);
    createConversation(user: any, merchantId: string): Promise<{
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
    search(conversationId: string, q: string): Promise<{
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
    markRead(conversationId: string, latestMessageId: string): Promise<{
        ok: boolean;
    }>;
    report(user: any, messageId: string, reason: string): Promise<{
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
    iceServers(): {
        iceServers: any[];
    };
    createInvite(user: any, conversationId: string): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        expiresAt: Date;
        conversationId: string;
        createdByUserId: string;
    }>;
    redeem(user: any, token: string): Promise<{
        conversationId: string;
    }>;
    upload(conversationId: string, files: any[]): Promise<{
        attachments: string[];
    }>;
}
