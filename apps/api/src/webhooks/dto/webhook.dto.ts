import { IsObject, IsString } from 'class-validator';

export class WebhookDto {
  @IsString()
  event: string;

  @IsObject()
  payload: Record<string, any>;
}


