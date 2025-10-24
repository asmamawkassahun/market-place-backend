import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhookDto } from './dto/webhook.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly service: WebhooksService) {}

  @Post(':provider')
  accept(@Param('provider') provider: 'telebirr'|'chapa'|'amole', @Body() body: WebhookDto, @Headers() headers: Record<string, string>) {
    // TODO: verify signatures per provider in production
    return this.service.accept(provider, body);
  }
}


