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
const notifications_service_1 = require("../notifications/notifications.service");
let ChatService = class ChatService {
    prisma;
    notify;
    constructor(prisma, notify) {
        this.prisma = prisma;
        this.notify = notify;
    }
    async getOrCreateConversation(userId, merchantId) {
        const existing = await this.prisma.conversation.findUnique({ where: { userId_merchantId: { userId, merchantId } } });
        if (existing)
            return existing;
        const merchant = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
        if (!merchant)
            throw new common_1.NotFoundException('Merchant not found');
        return this.prisma.conversation.create({ data: { userId, merchantId } });
    }
    async listMessages(conversationId) {
        return this.prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: 'asc' } });
    }
    async sendText(conversationId, senderRole, senderId, content) {
        const data = { conversationId, senderRole, type: 'TEXT', content };
        if (senderRole === 'BUYER')
            data.senderUserId = senderId;
        else
            data.senderMerchantId = senderId;
        const message = await this.prisma.message.create({ data });
        const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId }, include: { user: true, merchant: true } });
        if (conv) {
            if (senderRole === 'BUYER' && conv.user?.phone) {
                await this.notify.sms(conv.user.phone, 'You have a new message.');
            }
        }
        return message;
    }
    async sendSignal(conversationId, senderRole, senderId, payload) {
        const data = { conversationId, senderRole, type: 'SIGNAL', payload };
        if (senderRole === 'BUYER')
            data.senderUserId = senderId;
        else
            data.senderMerchantId = senderId;
        return this.prisma.message.create({ data });
    }
    async markRead(conversationId, latestMessageId) {
        await this.prisma.message.updateMany({ where: { conversationId, id: latestMessageId }, data: { readAt: new Date() } });
        return { ok: true };
    }
    async reportMessage(userId, messageId, reason) {
        return this.prisma.messageReport.create({ data: { messageId, reporterId: userId, reason } });
    }
    async listReports() {
        return this.prisma.messageReport.findMany({
            orderBy: { createdAt: 'desc' },
            include: { message: true, reporter: true },
        });
    }
    async resolveReport(reportId) {
        return this.prisma.messageReport.update({ where: { id: reportId }, data: { status: 'RESOLVED', resolvedAt: new Date() } });
    }
    async searchMessages(conversationId, q) {
        return this.prisma.message.findMany({
            where: { conversationId, content: { contains: q, mode: 'insensitive' } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async sendAttachments(conversationId, senderRole, senderId, attachments) {
        const data = { conversationId, senderRole, type: 'TEXT', attachments };
        if (senderRole === 'BUYER')
            data.senderUserId = senderId;
        else
            data.senderMerchantId = senderId;
        return this.prisma.message.create({ data });
    }
    async createInvite(conversationId, creatorUserId, ttlMinutes = 30) {
        const token = Math.random().toString(36).slice(2, 10);
        const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
        return this.prisma.chatInvite.create({ data: { token, conversationId, createdByUserId: creatorUserId, expiresAt } });
    }
    async redeemInvite(token, userId) {
        const invite = await this.prisma.chatInvite.findUnique({ where: { token } });
        if (!invite || invite.expiresAt < new Date())
            throw new common_1.NotFoundException('Invite invalid');
        return { conversationId: invite.conversationId };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notifications_service_1.NotificationsService])
], ChatService);
//# sourceMappingURL=chat.service.js.map