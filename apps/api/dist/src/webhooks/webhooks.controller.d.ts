import { WebhooksService } from './webhooks.service';
import { WebhookDto } from './dto/webhook.dto';
export declare class WebhooksController {
    private readonly service;
    constructor(service: WebhooksService);
    accept(provider: 'telebirr' | 'chapa' | 'amole', body: WebhookDto, headers: Record<string, string>): Promise<{
        ok: boolean;
    }>;
}
