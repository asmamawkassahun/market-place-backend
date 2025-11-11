import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SenderRole, MessageType } from '@prisma/client';
import { SendMessageDto, MarkReadDto } from './dto/chat.dto';
import { PusherService } from './pusher.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private pusherService: PusherService,
  ) {}

  async getOrCreateConversation(userId: string, merchantId: string) {
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

  async getConversations(userId: string, role: 'USER' | 'MERCHANT') {
    if (role === 'MERCHANT') {
      // For merchants, userId is actually the User.id (merchant's ownerId)
      // But conversation.merchantId is the Merchant.id, so we need to find the Merchant first
      const merchant = await this.prisma.merchant.findUnique({
        where: { ownerId: userId },
        select: { id: true, ownerId: true, displayName: true },
      });
      
      console.log(`[ChatService] getConversations for merchant - userId: ${userId}, merchant:`, merchant);
      
      if (!merchant) {
        console.error(`[ChatService] ❌ No merchant found for ownerId: ${userId}. Make sure the merchant record exists and ownerId matches the user's id.`);
        // Let's check if there are any merchants at all for debugging
        const allMerchants = await this.prisma.merchant.findMany({
          select: { id: true, ownerId: true, displayName: true },
          take: 5,
        });
        console.log(`[ChatService] Sample merchants in DB (first 5):`, allMerchants);
        return []; // No merchant record found
      }
      
      console.log(`[ChatService] Found merchant: ${merchant.displayName} (id: ${merchant.id}, ownerId: ${merchant.ownerId})`);
      
      const conversations = await this.prisma.conversation.findMany({
        where: {
          merchantId: merchant.id, // Use Merchant.id, not User.id
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
    } else {
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

  async getMessages(conversationId: string, userId: string, role: 'USER' | 'MERCHANT') {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify user has access
    if (role === 'MERCHANT') {
      // For merchants, userId is the User.id, but conversation.merchantId is Merchant.id
      // Need to check if the merchant's ownerId matches userId
      const merchant = await this.prisma.merchant.findUnique({
        where: { id: conversation.merchantId },
        select: { ownerId: true },
      });
      if (!merchant || merchant.ownerId !== userId) {
        throw new ForbiddenException('Access denied');
      }
    }
    if (role === 'USER' && conversation.userId !== userId) {
      throw new ForbiddenException('Access denied');
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

  async sendMessage(
    conversationId: string,
    userId: string,
    role: 'USER' | 'MERCHANT',
    dto: SendMessageDto,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify user has access
    if (role === 'MERCHANT') {
      // For merchants, userId is the User.id, but conversation.merchantId is Merchant.id
      // Need to check if the merchant's ownerId matches userId
      const merchant = await this.prisma.merchant.findUnique({
        where: { id: conversation.merchantId },
        select: { ownerId: true },
      });
      if (!merchant || merchant.ownerId !== userId) {
        throw new ForbiddenException('Access denied');
      }
    }
    if (role === 'USER' && conversation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const senderRole = role === 'MERCHANT' ? SenderRole.MERCHANT : SenderRole.BUYER;

    // For merchants, senderMerchantId should be the Merchant.id, not User.id
    const senderMerchantId = role === 'MERCHANT' 
      ? conversation.merchantId 
      : undefined;

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderRole,
        ...(role === 'MERCHANT'
          ? { senderMerchantId } // Use Merchant.id
          : { senderUserId: userId }), // Use User.id
        content: dto.content || null,
        type: dto.type || MessageType.TEXT,
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

    // Update conversation updatedAt
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Broadcast message via Pusher for real-time delivery
      try {
        const messageToBroadcast = {
          ...message,
        conversationId: conversationId,
        senderRole: message.senderRole as string,
          type: message.type as string,
        createdAt: message.createdAt.toISOString(),
          readAt: message.readAt ? message.readAt.toISOString() : null,
        };

      // Get merchant owner ID to determine channel names
      const merchantOwnerUserId = await this.getMerchantOwnerId(conversation.merchantId);
      const userId = conversation.userId;

      console.log('[ChatService] Broadcasting message via Pusher:', {
        messageId: message.id,
        conversationId,
        userId,
        merchantOwnerUserId,
        senderRole: role,
      });

      // Broadcast to conversation channel (private channel)
      const conversationChannel = `private-conversation-${conversationId}`;
      await this.pusherService.trigger(conversationChannel, 'message', messageToBroadcast);
      console.log(`[ChatService] ✅ Triggered 'message' event on ${conversationChannel}`);

      // Also trigger user-specific channels for instant delivery
      const userChannel = `private-user-${userId}`;
      const merchantChannel = merchantOwnerUserId ? `private-user-${merchantOwnerUserId}` : null;

      // Trigger on user's channel
      await this.pusherService.trigger(userChannel, 'new-message', {
        ...messageToBroadcast,
        conversationId,
      });
      console.log(`[ChatService] ✅ Triggered 'new-message' event on ${userChannel}`);

      // Trigger on merchant's channel if they exist
      if (merchantChannel) {
        await this.pusherService.trigger(merchantChannel, 'new-message', {
          ...messageToBroadcast,
          conversationId,
        });
        console.log(`[ChatService] ✅ Triggered 'new-message' event on ${merchantChannel}`);
      } else {
        console.warn(`[ChatService] ⚠️ No merchant channel - merchantOwnerUserId is null for merchantId: ${conversation.merchantId}`);
      }

      // Trigger new conversation event for merchants when user sends first message
      if (role === 'USER' && merchantOwnerUserId && merchantChannel) {
        await this.pusherService.trigger(merchantChannel, 'new-conversation', {
          conversationId,
          userId,
          merchantId: conversation.merchantId,
        });
        console.log(`[ChatService] ✅ Triggered 'new-conversation' event on ${merchantChannel}`);
      }
    } catch (error) {
      console.error('[ChatService] ❌ Failed to broadcast message via Pusher:', error);
      // Don't fail the request if Pusher fails - message is still saved
    }

    return message;
  }

  async getConversationById(conversationId: string) {
    return this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
  }

  async getMerchantOwnerId(merchantId: string): Promise<string | null> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      select: { ownerId: true },
    });
    return merchant?.ownerId || null;
  }

  async markAsRead(conversationId: string, messageId: string, userId: string, role: 'USER' | 'MERCHANT') {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify user has access
    if (role === 'MERCHANT') {
      // For merchants, userId is the User.id, but conversation.merchantId is Merchant.id
      // Need to check if the merchant's ownerId matches userId
      const merchant = await this.prisma.merchant.findUnique({
        where: { id: conversation.merchantId },
        select: { ownerId: true },
      });
      if (!merchant || merchant.ownerId !== userId) {
        throw new ForbiddenException('Access denied');
      }
    }
    if (role === 'USER' && conversation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.conversationId !== conversationId) {
      throw new NotFoundException('Message not found');
    }

    // Only mark messages from the other party as read
    const targetRole = role === 'MERCHANT' ? SenderRole.BUYER : SenderRole.MERCHANT;
    if (message.senderRole !== targetRole) {
      return message; // Not a message from the other party
    }

    // Mark this message and all previous unread messages from the other party as read
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

    // Broadcast read receipt via Pusher
    try {
      const conversationChannel = `private-conversation-${conversationId}`;
      await this.pusherService.trigger(conversationChannel, 'message-read', {
        messageId,
        conversationId,
        readAt: new Date().toISOString(),
        readBy: userId,
      });
    } catch (error) {
      console.error('Failed to broadcast read receipt via Pusher:', error);
    }

    return updatedMessage;
  }
}

