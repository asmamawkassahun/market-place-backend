import type { Response } from 'express';
import { ChatService } from './chat.service';
import { PusherService } from './pusher.service';
import { SendMessageDto, MarkReadDto } from './dto/chat.dto';
export declare class ChatController {
    private chatService;
    private pusherService;
    constructor(chatService: ChatService, pusherService: PusherService);
    getConversations(user: any): Promise<{
        data: ({
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
        })[];
    }>;
    createConversation(user: any, body: {
        merchantId: string;
    }): Promise<{
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
    getMessages(id: string, user: any): Promise<({
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
    sendMessage(id: string, dto: SendMessageDto, user: any): Promise<{
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
    sendMessageToMerchant(body: SendMessageDto & {
        merchantId?: string;
    }, user: any): Promise<({
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
    }) | {
        error: string;
    }>;
    markAsRead(conversationId: string, dto: MarkReadDto, user: any): Promise<{
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
    testPusherRoute(): Promise<{
        message: string;
        timestamp: string;
    }>;
    authenticatePusher(req: any, res: Response, user: any): Promise<Response<any, Record<string, any>>>;
}
