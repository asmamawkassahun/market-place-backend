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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PusherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PusherService = void 0;
const common_1 = require("@nestjs/common");
const pusher_1 = __importDefault(require("pusher"));
const config_1 = require("@nestjs/config");
let PusherService = PusherService_1 = class PusherService {
    configService;
    pusher;
    logger = new common_1.Logger(PusherService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.pusher = new pusher_1.default({
            appId: this.configService.get('PUSHER_APP_ID') || '',
            key: this.configService.get('PUSHER_KEY') || '',
            secret: this.configService.get('PUSHER_SECRET') || '',
            cluster: this.configService.get('PUSHER_CLUSTER') || 'us2',
            useTLS: true,
        });
        this.logger.log('Pusher service initialized');
    }
    async trigger(channel, event, data) {
        try {
            await this.pusher.trigger(channel, event, data);
            this.logger.debug(`Triggered event '${event}' on channel '${channel}'`);
        }
        catch (error) {
            this.logger.error(`Failed to trigger event '${event}' on channel '${channel}':`, error);
            throw error;
        }
    }
    async triggerBatch(channels, event, data) {
        try {
            await this.pusher.trigger(channels, event, data);
            this.logger.debug(`Triggered event '${event}' on ${channels.length} channels`);
        }
        catch (error) {
            this.logger.error(`Failed to trigger batch event '${event}':`, error);
            throw error;
        }
    }
    authenticate(socketId, channel, channelData) {
        try {
            return this.pusher.authorizeChannel(socketId, channel, channelData);
        }
        catch (error) {
            this.logger.error(`Failed to authenticate channel '${channel}':`, error);
            throw error;
        }
    }
    authenticatePresence(socketId, channel, presenceData) {
        try {
            return this.pusher.authorizeChannel(socketId, channel, {
                user_id: presenceData.user_id,
                user_info: presenceData.user_info,
            });
        }
        catch (error) {
            this.logger.error(`Failed to authenticate presence channel '${channel}':`, error);
            throw error;
        }
    }
    authenticatePrivate(socketId, channel) {
        return this.authenticate(socketId, channel);
    }
    getInstance() {
        return this.pusher;
    }
};
exports.PusherService = PusherService;
exports.PusherService = PusherService = PusherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PusherService);
//# sourceMappingURL=pusher.service.js.map