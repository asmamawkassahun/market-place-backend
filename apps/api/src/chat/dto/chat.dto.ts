import { IsString, IsOptional, IsEnum, IsArray, MaxLength } from 'class-validator';
import { MessageType, SenderRole } from '@prisma/client';

export class SendMessageDto {
  @IsString()
  @MaxLength(5000)
  content?: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}

export class CreateConversationDto {
  @IsString()
  merchantId: string;
}

export class MarkReadDto {
  @IsString()
  messageId: string;
}




