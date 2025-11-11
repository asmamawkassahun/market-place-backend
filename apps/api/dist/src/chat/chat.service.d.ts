import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/chat.dto';
import { PusherService } from './pusher.service';
export declare class ChatService {
    private prisma;
    private pusherService;
    constructor(prisma: PrismaService, pusherService: PusherService);
    getOrCreateConversation(userId: string, merchantId: string): Promise<{
        merchant: {
            id: string;
            displayName: string;
            logoUrl: string | null;
        };
        messages: {
            id: string;
            createdAt: Date;
            attachments: string[];
            type: import("@prisma/client").$Enums.MessageType;
            readAt: Date | null;
            payload: import("@prisma/client/runtime/library").JsonValue | null;
            content: string | null;
            conversationId: string;
            senderUserId: string | null;
            senderMerchantId: string | null;
            senderRole: import("@prisma/client").$Enums.SenderRole;
        }[];
        user: {
            id: string;
            name: string | null;
            phone: string | null;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        userId: string;
    }>;
    getConversations(userId: string, role: 'USER' | 'MERCHANT'): Promise<({
        merchant: {
            id: string;
            displayName: string;
            logoUrl: string | null;
        };
        messages: {
            id: string;
            createdAt: Date;
            attachments: string[];
            type: import("@prisma/client").$Enums.MessageType;
            readAt: Date | null;
            payload: import("@prisma/client/runtime/library").JsonValue | null;
            content: string | null;
            conversationId: string;
            senderUserId: string | null;
            senderMerchantId: string | null;
            senderRole: import("@prisma/client").$Enums.SenderRole;
        }[];
        user: {
            id: string;
            name: string | null;
            phone: string | null;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        userId: string;
    })[]>;
    getMessages(conversationId: string, userId: string, role: 'USER' | 'MERCHANT'): Promise<({
        senderUser: {
            id: string;
            name: string | null;
            email: string;
        } | null;
        senderMerchant: {
            id: string;
            displayName: string;
            logoUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        attachments: string[];
        type: import("@prisma/client").$Enums.MessageType;
        readAt: Date | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        content: string | null;
        conversationId: string;
        senderUserId: string | null;
        senderMerchantId: string | null;
        senderRole: import("@prisma/client").$Enums.SenderRole;
    })[]>;
    sendMessage(conversationId: string, userId: string, role: 'USER' | 'MERCHANT', dto: SendMessageDto): Promise<{
        senderUser: {
            id: string;
            name: string | null;
            email: string;
        } | null;
        senderMerchant: {
            id: string;
            displayName: string;
            logoUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        attachments: string[];
        type: import("@prisma/client").$Enums.MessageType;
        readAt: Date | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        content: string | null;
        conversationId: string;
        senderUserId: string | null;
        senderMerchantId: string | null;
        senderRole: import("@prisma/client").$Enums.SenderRole;
    }>;
    getConversationById(conversationId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        userId: string;
    } | null>;
    getMerchantOwnerId(merchantId: string): Promise<string | null>;
    markAsRead(conversationId: string, messageId: string, userId: string, role: 'USER' | 'MERCHANT'): Promise<{
        id: string;
        createdAt: Date;
        attachments: string[];
        type: import("@prisma/client").$Enums.MessageType;
        readAt: Date | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        content: string | null;
        conversationId: string;
        senderUserId: string | null;
        senderMerchantId: string | null;
        senderRole: import("@prisma/client").$Enums.SenderRole;
    } | null>;
}
