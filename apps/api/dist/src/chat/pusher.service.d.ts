import Pusher from 'pusher';
import { ConfigService } from '@nestjs/config';
export declare class PusherService {
    private configService;
    private pusher;
    private readonly logger;
    constructor(configService: ConfigService);
    trigger(channel: string, event: string, data: any): Promise<void>;
    triggerBatch(channels: string[], event: string, data: any): Promise<void>;
    authenticate(socketId: string, channel: string, channelData?: any): any;
    authenticatePresence(socketId: string, channel: string, presenceData: any): any;
    authenticatePrivate(socketId: string, channel: string): any;
    getInstance(): Pusher;
}
