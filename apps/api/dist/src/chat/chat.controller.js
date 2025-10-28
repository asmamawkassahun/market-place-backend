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
const chat_service_1 = require("./chat.service");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const storage_service_1 = require("../storage/storage.service");
let ChatController = class ChatController {
    service;
    storage;
    constructor(service, storage) {
        this.service = service;
        this.storage = storage;
    }
    createConversation(user, merchantId) {
        return this.service.getOrCreateConversation(user.userId, merchantId);
    }
    listMessages(conversationId) {
        return this.service.listMessages(conversationId);
    }
    search(conversationId, q) {
        return this.service.searchMessages(conversationId, q);
    }
    markRead(conversationId, latestMessageId) {
        return this.service.markRead(conversationId, latestMessageId);
    }
    report(user, messageId, reason) {
        return this.service.reportMessage(user.userId, messageId, reason);
    }
    listReports() {
        return this.service.listReports();
    }
    resolveReport(reportId) {
        return this.service.resolveReport(reportId);
    }
    iceServers() {
        const stun = process.env.STUN_URL || 'stun:stun.l.google.com:19302';
        const turn = process.env.TURN_URL;
        const username = process.env.TURN_USERNAME;
        const credential = process.env.TURN_CREDENTIAL;
        const iceServers = [{ urls: stun }];
        if (turn && username && credential) {
            iceServers.push({ urls: turn, username, credential });
        }
        return { iceServers };
    }
    createInvite(user, conversationId) {
        return this.service.createInvite(conversationId, user.userId);
    }
    redeem(user, token) {
        return this.service.redeemInvite(token, user.userId);
    }
    async upload(conversationId, files) {
        const urls = [];
        for (const file of files ?? []) {
            const key = `chat/${conversationId}/${Date.now()}-${file.originalname}`;
            const { url } = await this.storage.upload(key, file.buffer, file.mimetype);
            urls.push(url);
        }
        await this.service.sendAttachments(conversationId, 'BUYER', 'unknown', urls);
        return { attachments: urls };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('conversations/:merchantId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('conversations/:conversationId/messages'),
    __param(0, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Get)('conversations/:conversationId/search'),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "search", null);
__decorate([
    (0, common_1.Post)('conversations/:conversationId/read/:latestMessageId'),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Param)('latestMessageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "markRead", null);
__decorate([
    (0, common_1.Post)('messages/:messageId/report'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "report", null);
__decorate([
    (0, common_1.Get)('admin/reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "listReports", null);
__decorate([
    (0, common_1.Patch)('admin/reports/:reportId/resolve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "resolveReport", null);
__decorate([
    (0, common_1.Get)('ice'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "iceServers", null);
__decorate([
    (0, common_1.Post)('conversations/:conversationId/invites'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "createInvite", null);
__decorate([
    (0, common_1.Post)('invites/:token/redeem'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "redeem", null);
__decorate([
    (0, common_1.Post)('conversations/:conversationId/attachments'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "upload", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService, storage_service_1.StorageService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map