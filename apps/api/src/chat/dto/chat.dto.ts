import { IsOptional, IsString } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  conversationId: string;

  @IsOptional()
  @IsString()
  content?: string;
}


