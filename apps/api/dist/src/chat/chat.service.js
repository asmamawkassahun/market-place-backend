"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const pusher_service_1 = require("./pusher.service");
let ChatService = class ChatService {
    prisma;
    pusherService;
    constructor(prisma, pusherService) {
        this.prisma = prisma;
        this.pusherService = pusherService;
    }
    async getOrCreateConversation(userId, merchantId) {
        const conversation = await this.prisma.conversation.findUnique({
            where: {
                userId_merchantId: {
                    userId,
                    merchantId,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                merchant: {
                    select: {
                        id: true,
                        displayName: true,
                        logoUrl: true,
                    },
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (conversation) {
            return conversation;
        }
        return this.prisma.conversation.create({
            data: {
                userId,
                merchantId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                merchant: {
                    select: {
                        id: true,
                        displayName: true,
                        logoUrl: true,
                    },
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
    async getConversations(userId, role) {
        if (role === 'MERCHANT') {
            const merchant = await this.prisma.merchant.findUnique({
                where: { ownerId: userId },
                select: { id: true, ownerId: true, displayName: true },
            });
            console.log(`[ChatService] getConversations for merchant - userId: ${userId}, merchant:`, merchant);
            if (!merchant) {
                console.error(`[ChatService] ❌ No merchant found for ownerId: ${userId}. Make sure the merchant record exists and ownerId matches the user's id.`);
                const allMerchants = await this.prisma.merchant.findMany({
                    select: { id: true, ownerId: true, displayName: true },
                    take: 5,
                });
                console.log(`[ChatService] Sample merchants in DB (first 5):`, allMerchants);
                return [];
            }
            console.log(`[ChatService] Found merchant: ${merchant.displayName} (id: ${merchant.id}, ownerId: ${merchant.ownerId})`);
            const conversations = await this.prisma.conversation.findMany({
                where: {
                    merchantId: merchant.id,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                    merchant: {
                        select: {
                            id: true,
                            displayName: true,
                            logoUrl: true,
                        },
                    },
                    messages: {
                        take: 1,
                        orderBy: { createdAt: 'desc' },
                    },
                },
                orderBy: {
                    updatedAt: 'desc',
                },
            });
            console.log(`[ChatService] ✅ Found ${conversations.length} conversations for merchant ${merchant.id} (${merchant.displayName})`);
            if (conversations.length > 0) {
                console.log(`[ChatService] Conversation IDs:`, conversations.map(c => c.id));
            }
            return conversations;
        }
        else {
            return this.prisma.conversation.findMany({
                where: {
                    userId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                    merchant: {
                        select: {
                            id: true,
                            displayName: true,
                            logoUrl: true,
                        },
                    },
                    messages: {
                        take: 1,
                        orderBy: { createdAt: 'desc' },
                    },
                },
                orderBy: {
                    updatedAt: 'desc',
                },
            });
        }
    }
    async getMessages(conversationId, userId, role) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        if (role === 'MERCHANT') {
            const merchant = await this.prisma.merchant.findUnique({
                where: { id: conversation.merchantId },
                select: { ownerId: true },
            });
            if (!merchant || merchant.ownerId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        if (role === 'USER' && conversation.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.message.findMany({
            where: { conversationId },
            include: {
                senderUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                senderMerchant: {
                    select: {
                        id: true,
                        displayName: true,
                        logoUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async sendMessage(conversationId, userId, role, dto) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        if (role === 'MERCHANT') {
            const merchant = await this.prisma.merchant.findUnique({
                where: { id: conversation.merchantId },
                select: { ownerId: true },
            });
            if (!merchant || merchant.ownerId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        if (role === 'USER' && conversation.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const senderRole = role === 'MERCHANT' ? client_1.SenderRole.MERCHANT : client_1.SenderRole.BUYER;
        const senderMerchantId = role === 'MERCHANT'
            ? conversation.merchantId
            : undefined;
        const message = await this.prisma.message.create({
            data: {
                conversationId,
                senderRole,
                ...(role === 'MERCHANT'
                    ? { senderMerchantId }
                    : { senderUserId: userId }),
                content: dto.content || null,
                type: dto.type || client_1.MessageType.TEXT,
                attachments: dto.attachments || [],
            },
            include: {
                senderUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                senderMerchant: {
                    select: {
                        id: true,
                        displayName: true,
                        logoUrl: true,
                    },
                },
            },
        });
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });
        try {
            const messageToBroadcast = {
                ...message,
                conversationId: conversationId,
                senderRole: message.senderRole,
                type: message.type,
                createdAt: message.createdAt.toISOString(),
                readAt: message.readAt ? message.readAt.toISOString() : null,
            };
            const merchantOwnerUserId = await this.getMerchantOwnerId(conversation.merchantId);
            const userId = conversation.userId;
            console.log('[ChatService] Broadcasting message via Pusher:', {
                messageId: message.id,
                conversationId,
                userId,
                merchantOwnerUserId,
                senderRole: role,
            });
            const conversationChannel = `private-conversation-${conversationId}`;
            await this.pusherService.trigger(conversationChannel, 'message', messageToBroadcast);
            console.log(`[ChatService] ✅ Triggered 'message' event on ${conversationChannel}`);
            const userChannel = `private-user-${userId}`;
            const merchantChannel = merchantOwnerUserId ? `private-user-${merchantOwnerUserId}` : null;
            await this.pusherService.trigger(userChannel, 'new-message', {
                ...messageToBroadcast,
                conversationId,
            });
            console.log(`[ChatService] ✅ Triggered 'new-message' event on ${userChannel}`);
            if (merchantChannel) {
                await this.pusherService.trigger(merchantChannel, 'new-message', {
                    ...messageToBroadcast,
                    conversationId,
                });
                console.log(`[ChatService] ✅ Triggered 'new-message' event on ${merchantChannel}`);
            }
            else {
                console.warn(`[ChatService] ⚠️ No merchant channel - merchantOwnerUserId is null for merchantId: ${conversation.merchantId}`);
            }
            if (role === 'USER' && merchantOwnerUserId && merchantChannel) {
                await this.pusherService.trigger(merchantChannel, 'new-conversation', {
                    conversationId,
                    userId,
                    merchantId: conversation.merchantId,
                });
                console.log(`[ChatService] ✅ Triggered 'new-conversation' event on ${merchantChannel}`);
            }
        }
        catch (error) {
            console.error('[ChatService] ❌ Failed to broadcast message via Pusher:', error);
        }
        return message;
    }
    async getConversationById(conversationId) {
        return this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
    }
    async getMerchantOwnerId(merchantId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
            select: { ownerId: true },
        });
        return merchant?.ownerId || null;
    }
    async markAsRead(conversationId, messageId, userId, role) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        if (role === 'MERCHANT') {
            const merchant = await this.prisma.merchant.findUnique({
                where: { id: conversation.merchantId },
                select: { ownerId: true },
            });
            if (!merchant || merchant.ownerId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        if (role === 'USER' && conversation.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message || message.conversationId !== conversationId) {
            throw new common_1.NotFoundException('Message not found');
        }
        const targetRole = role === 'MERCHANT' ? client_1.SenderRole.BUYER : client_1.SenderRole.MERCHANT;
        if (message.senderRole !== targetRole) {
            return message;
        }
        await this.prisma.message.updateMany({
            where: {
                conversationId,
                senderRole: targetRole,
                readAt: null,
                createdAt: {
                    lte: message.createdAt,
                },
            },
            data: {
                readAt: new Date(),
            },
        });
        const updatedMessage = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        try {
            const conversationChannel = `private-conversation-${conversationId}`;
            await this.pusherService.trigger(conversationChannel, 'message-read', {
                messageId,
                conversationId,
                readAt: new Date().toISOString(),
                readBy: userId,
            });
        }
        catch (error) {
            console.error('Failed to broadcast read receipt via Pusher:', error);
        }
        return updatedMessage;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pusher_service_1.PusherService])
], ChatService);
//# sourceMappingURL=chat.service.js.map