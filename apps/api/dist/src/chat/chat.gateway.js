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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const jwt_1 = require("@nestjs/jwt");
let ChatGateway = class ChatGateway {
    chat;
    jwt;
    server;
    constructor(chat, jwt) {
        this.chat = chat;
        this.jwt = jwt;
    }
    handleConnection(client) {
        const token = client.handshake.auth?.token || client.handshake.query?.token || client.handshake.headers['authorization']?.replace('Bearer ', '');
        if (!token)
            return client.disconnect();
        try {
            const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'dev_secret' });
            client.user = { userId: payload.sub, role: payload.role };
        }
        catch (e) {
            return client.disconnect();
        }
    }
    async join(client, payload) {
        await client.join(payload.conversationId);
        client.emit('joined', { conversationId: payload.conversationId });
    }
    async text(client, payload) {
        const msg = await this.chat.sendText(payload.conversationId, payload.senderRole, payload.senderId, payload.content);
        this.server.to(payload.conversationId).emit('message', msg);
    }
    async signal(client, payload) {
        const msg = await this.chat.sendSignal(payload.conversationId, payload.senderRole, payload.senderId, payload.data);
        this.server.to(payload.conversationId).emit('signal', msg);
    }
    async typing(client, payload) {
        this.server.to(payload.conversationId).emit('typing', { role: payload.senderRole });
    }
    async read(client, payload) {
        await this.chat.markRead(payload.conversationId, payload.latestMessageId);
        this.server.to(payload.conversationId).emit('read', { latestMessageId: payload.latestMessageId });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "join", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('text'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "text", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('signal'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "signal", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "typing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "read", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' }, namespace: '/chat' }),
    __metadata("design:paramtypes", [chat_service_1.ChatService, jwt_1.JwtService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map