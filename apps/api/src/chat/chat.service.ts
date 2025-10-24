import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private notify: NotificationsService) {}

  async getOrCreateConversation(userId: string, merchantId: string) {
    const existing = await this.prisma.conversation.findUnique({ where: { userId_merchantId: { userId, merchantId } } });
    if (existing) return existing;
    // Ensure merchant exists
    const merchant = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!merchant) throw new NotFoundException('Merchant not found');
    return this.prisma.conversation.create({ data: { userId, merchantId } });
  }

  async listMessages(conversationId: string) {
    return this.prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: 'asc' } });
  }

  async sendText(conversationId: string, senderRole: 'BUYER'|'MERCHANT', senderId: string, content: string) {
    const data: any = { conversationId, senderRole, type: 'TEXT', content };
    if (senderRole === 'BUYER') data.senderUserId = senderId; else data.senderMerchantId = senderId;
    const message = await this.prisma.message.create({ data });
    // Best-effort notify the counterparty via SMS if address/phone present
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId }, include: { user: true, merchant: true } });
    if (conv) {
      if (senderRole === 'BUYER' && conv.user?.phone) {
        await this.notify.sms(conv.user.phone, 'You have a new message.');
      }
    }
    return message;
  }

  async sendSignal(conversationId: string, senderRole: 'BUYER'|'MERCHANT', senderId: string, payload: any) {
    const data: any = { conversationId, senderRole, type: 'SIGNAL', payload };
    if (senderRole === 'BUYER') data.senderUserId = senderId; else data.senderMerchantId = senderId;
    return this.prisma.message.create({ data });
  }

  async markRead(conversationId: string, latestMessageId: string) {
    await this.prisma.message.updateMany({ where: { conversationId, id: latestMessageId }, data: { readAt: new Date() } });
    return { ok: true };
  }

  async reportMessage(userId: string, messageId: string, reason: string) {
    return this.prisma.messageReport.create({ data: { messageId, reporterId: userId, reason } });
  }

  async listReports() {
    return this.prisma.messageReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: { message: true, reporter: true },
    });
  }

  async resolveReport(reportId: string) {
    return this.prisma.messageReport.update({ where: { id: reportId }, data: { status: 'RESOLVED' as any, resolvedAt: new Date() } });
  }

  async searchMessages(conversationId: string, q: string) {
    return this.prisma.message.findMany({
      where: { conversationId, content: { contains: q, mode: 'insensitive' } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendAttachments(conversationId: string, senderRole: 'BUYER'|'MERCHANT', senderId: string, attachments: string[]) {
    const data: any = { conversationId, senderRole, type: 'TEXT', attachments };
    if (senderRole === 'BUYER') data.senderUserId = senderId; else data.senderMerchantId = senderId;
    return this.prisma.message.create({ data });
  }

  async createInvite(conversationId: string, creatorUserId: string, ttlMinutes = 30) {
    const token = Math.random().toString(36).slice(2, 10);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    return this.prisma.chatInvite.create({ data: { token, conversationId, createdByUserId: creatorUserId, expiresAt } });
  }

  async redeemInvite(token: string, userId: string) {
    const invite = await this.prisma.chatInvite.findUnique({ where: { token } });
    if (!invite || invite.expiresAt < new Date()) throw new NotFoundException('Invite invalid');
    // Ensure conversation exists for user; here simply return the conversation id
    return { conversationId: invite.conversationId };
  }
}


