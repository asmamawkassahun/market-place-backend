import { ReferralService } from '../referral/referral.service';
export declare class OrderEventsListener {
    private referralService;
    private readonly logger;
    constructor(referralService: ReferralService);
    handleOrderCompleted(payload: {
        orderId: string;
        userId: string;
        totalAmount: number;
    }): Promise<void>;
}
