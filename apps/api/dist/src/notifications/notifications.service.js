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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNotifications(userId, params) {
        const { page, limit, type, read, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (type)
            where.type = type;
        if (read !== undefined)
            where.read = read;
        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    user: {
                        select: { id: true, phone: true, name: true }
                    }
                }
            }),
            this.prisma.notification.count({ where })
        ]);
        const unreadCount = await this.prisma.notification.count({
            where: { userId, read: false }
        });
        return {
            notifications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            unreadCount
        };
    }
    async getNotification(userId, id) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId },
            include: {
                user: {
                    select: { id: true, phone: true, name: true }
                }
            }
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return notification;
    }
    async markAsRead(userId, id) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId }
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return this.prisma.notification.update({
            where: { id },
            data: { read: true, readAt: new Date() }
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true, readAt: new Date() }
        });
    }
    async deleteNotification(userId, id) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId }
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return this.prisma.notification.delete({ where: { id } });
    }
    async clearAllNotifications(userId) {
        return this.prisma.notification.deleteMany({ where: { userId } });
    }
    async getUnreadCount(userId) {
        const count = await this.prisma.notification.count({
            where: { userId, read: false }
        });
        return { count };
    }
    async updatePreferences(userId, preferences) {
        return { userId, preferences };
    }
    async getPreferences(userId) {
        return {
            userId,
            preferences: {
                email: true,
                sms: true,
                push: true,
                priceAlerts: true,
                stockNotifications: true,
                orderUpdates: true,
                promotions: true
            }
        };
    }
    async sms(to, text) { return { to, text }; }
    async email(to, subject, html) { return { to, subject }; }
    async push(to, title, body) { return { to, title, body }; }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map