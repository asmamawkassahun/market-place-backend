import { Injectable, Logger } from '@nestjs/common';
import Pusher from 'pusher';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PusherService {
  private pusher: Pusher;
  private readonly logger = new Logger(PusherService.name);

  constructor(private configService: ConfigService) {
    this.pusher = new Pusher({
      appId: this.configService.get<string>('PUSHER_APP_ID') || '',
      key: this.configService.get<string>('PUSHER_KEY') || '',
      secret: this.configService.get<string>('PUSHER_SECRET') || '',
      cluster: this.configService.get<string>('PUSHER_CLUSTER') || 'us2',
      useTLS: true,
    });
    
    this.logger.log('Pusher service initialized');
  }

  /**
   * Trigger an event on a channel
   */
  async trigger(channel: string, event: string, data: any): Promise<void> {
    try {
      await this.pusher.trigger(channel, event, data);
      this.logger.debug(`Triggered event '${event}' on channel '${channel}'`);
    } catch (error) {
      this.logger.error(`Failed to trigger event '${event}' on channel '${channel}':`, error);
      throw error;
    }
  }

  /**
   * Trigger events on multiple channels
   */
  async triggerBatch(channels: string[], event: string, data: any): Promise<void> {
    try {
      await this.pusher.trigger(channels, event, data);
      this.logger.debug(`Triggered event '${event}' on ${channels.length} channels`);
    } catch (error) {
      this.logger.error(`Failed to trigger batch event '${event}':`, error);
      throw error;
    }
  }

  /**
   * Authenticate private channel subscription
   */
  authenticate(socketId: string, channel: string, channelData?: any): any {
    try {
      return this.pusher.authorizeChannel(socketId, channel, channelData);
    } catch (error) {
      this.logger.error(`Failed to authenticate channel '${channel}':`, error);
      throw error;
    }
  }

  /**
   * Authenticate presence channel subscription
   */
  authenticatePresence(socketId: string, channel: string, presenceData: any): any {
    try {
      return this.pusher.authorizeChannel(socketId, channel, {
        user_id: presenceData.user_id,
        user_info: presenceData.user_info,
      });
    } catch (error) {
      this.logger.error(`Failed to authenticate presence channel '${channel}':`, error);
      throw error;
    }
  }

  /**
   * Authenticate private channel (same as authenticate but clearer naming)
   */
  authenticatePrivate(socketId: string, channel: string): any {
    return this.authenticate(socketId, channel);
  }

  /**
   * Get Pusher instance (for advanced usage)
   */
  getInstance(): Pusher {
    return this.pusher;
  }
}

