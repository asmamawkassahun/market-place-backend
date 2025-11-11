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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const chat_service_1 = require("./chat.service");
const pusher_service_1 = require("./pusher.service");
const chat_dto_1 = require("./dto/chat.dto");
let ChatController = class ChatController {
    chatService;
    pusherService;
    constructor(chatService, pusherService) {
        this.chatService = chatService;
        this.pusherService = pusherService;
    }
    async getConversations(user) {
        const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
        console.log(`[ChatController] getConversations called - role: ${role}, userId: ${user.userId}, email: ${user.email}`);
        const conversations = await this.chatService.getConversations(user.userId, role);
        console.log(`[ChatController] getConversations result - role: ${role}, userId: ${user.userId}, count: ${conversations.length}`);
        if (role === 'MERCHANT' && conversations.length === 0) {
            console.warn(`[ChatController] Merchant ${user.userId} has no conversations - this might indicate no merchant record exists or no conversations have been created`);
        }
        return { data: conversations };
    }
    async createConversation(user, body) {
        return this.chatService.getOrCreateConversation(user.userId, body.merchantId);
    }
    async getMessages(id, user) {
        const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
        return this.chatService.getMessages(id, user.userId, role);
    }
    async sendMessage(id, dto, user) {
        const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
        return this.chatService.sendMessage(id, user.userId, role, dto);
    }
    async sendMessageToMerchant(body, user) {
        if (!body.merchantId) {
            return { error: 'Merchant ID is required' };
        }
        const conversation = await this.chatService.getOrCreateConversation(user.userId, body.merchantId);
        const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
        return this.chatService.sendMessage(conversation.id, user.userId, role, {
            content: body.content,
            type: body.type,
            attachments: body.attachments,
        });
    }
    async markAsRead(conversationId, dto, user) {
        const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
        return this.chatService.markAsRead(conversationId, dto.messageId, user.userId, role);
    }
    async testPusherRoute() {
        console.log('[ChatController] Test route called - routing is working!');
        return { message: 'Pusher route test - route is accessible', timestamp: new Date().toISOString() };
    }
    async authenticatePusher(req, res, user) {
        const socketId = req.body?.socket_id || req.query?.socket_id || req.body?.socketId;
        const channelName = req.body?.channel_name || req.query?.channel_name || req.body?.channelName;
        console.log('[Pusher Auth] Raw request:', {
            method: req.method,
            url: req.url,
            path: req.path,
            originalUrl: req.originalUrl,
            body: req.body,
            query: req.query,
            contentType: req.headers['content-type'],
        });
        console.log('[Pusher Auth] Request received:', {
            method: req.method,
            url: req.url,
            originalUrl: req.originalUrl,
            path: req.path,
            socketId,
            channelName,
            userId: user?.userId,
            role: user?.role,
            headers: {
                authorization: req.headers.authorization ? 'present' : 'missing',
            }
        });
        if (!socketId || !channelName) {
            console.error('[Pusher Auth] Missing socket_id or channel_name');
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Missing socket_id or channel_name' });
        }
        if (!user || !user.userId) {
            console.error('[Pusher Auth] User not authenticated');
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ error: 'Not authenticated' });
        }
        try {
            if (channelName.startsWith('private-conversation-')) {
                const conversationId = channelName.replace('private-conversation-', '');
                console.log('[Pusher Auth] Authenticating conversation channel:', conversationId);
                const conversation = await this.chatService.getConversationById(conversationId);
                if (!conversation) {
                    console.error('[Pusher Auth] Conversation not found:', conversationId);
                    return res.status(common_1.HttpStatus.FORBIDDEN).json({ error: 'Conversation not found' });
                }
                const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
                const merchantOwnerId = await this.chatService.getMerchantOwnerId(conversation.merchantId);
                console.log('[Pusher Auth] Access check:', {
                    role,
                    userId: user.userId,
                    conversationUserId: conversation.userId,
                    merchantOwnerId,
                });
                const hasAccess = (role === 'USER' && conversation.userId === user.userId) ||
                    (role === 'MERCHANT' && merchantOwnerId === user.userId);
                if (!hasAccess) {
                    console.error('[Pusher Auth] Access denied for conversation:', conversationId);
                    return res.status(common_1.HttpStatus.FORBIDDEN).json({ error: 'Access denied' });
                }
                const auth = this.pusherService.authenticatePrivate(socketId, channelName);
                console.log('[Pusher Auth] ✅ Successfully authenticated conversation channel:', conversationId);
                return res.status(common_1.HttpStatus.OK).json(auth);
            }
            if (channelName.startsWith('private-user-')) {
                const channelUserId = channelName.replace('private-user-', '');
                console.log('[Pusher Auth] Authenticating user channel:', channelUserId);
                if (channelUserId !== user.userId) {
                    console.error('[Pusher Auth] Access denied - user mismatch:', { channelUserId, userId: user.userId });
                    return res.status(common_1.HttpStatus.FORBIDDEN).json({ error: 'Access denied' });
                }
                const auth = this.pusherService.authenticatePrivate(socketId, channelName);
                console.log('[Pusher Auth] ✅ Successfully authenticated user channel:', channelUserId);
                return res.status(common_1.HttpStatus.OK).json(auth);
            }
            console.error('[Pusher Auth] Invalid channel name:', channelName);
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Invalid channel name' });
        }
        catch (error) {
            console.error('[Pusher Auth] Exception during authentication:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Authentication failed' });
        }
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('conversations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Post)('conversations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('conversations/:id/messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('conversations/:id/messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessageToMerchant", null);
__decorate([
    (0, common_1.Post)('conversations/:id/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_dto_1.MarkReadDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)('pusher-test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "testPusherRoute", null);
__decorate([
    (0, common_1.Post)('pusher-auth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "authenticatePusher", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        pusher_service_1.PusherService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map