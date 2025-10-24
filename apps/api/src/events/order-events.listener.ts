import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReferralService } from '../referral/referral.service';

@Injectable()
export class OrderEventsListener {
  private readonly logger = new Logger(OrderEventsListener.name);

  constructor(
    private referralService: ReferralService,
  ) {}

  @OnEvent('order.completed')
  async handleOrderCompleted(payload: { orderId: string; userId: string; totalAmount: number }) {
    this.logger.log(`Order completed: ${payload.orderId} for user ${payload.userId}`);
    
    try {
      // Award referral rewards if applicable
      await this.referralService.awardReferralRewards(payload.orderId);
    } catch (error) {
      this.logger.error('Error handling order completion:', error);
    }
  }
}
