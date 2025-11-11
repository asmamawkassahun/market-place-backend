import { MessageType } from '@prisma/client';
export declare class SendMessageDto {
    content?: string;
    type?: MessageType;
    attachments?: string[];
}
export declare class CreateConversationDto {
    merchantId: string;
}
export declare class MarkReadDto {
    messageId: string;
}
