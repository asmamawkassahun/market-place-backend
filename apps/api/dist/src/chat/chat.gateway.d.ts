import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
export declare class ChatGateway implements OnGatewayConnection {
    private chat;
    private jwt;
    server: Server;
    constructor(chat: ChatService, jwt: JwtService);
    handleConnection(client: Socket): Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | undefined;
    join(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
    text(client: Socket, payload: {
        conversationId: string;
        senderRole: 'BUYER' | 'MERCHANT';
        senderId: string;
        content: string;
    }): Promise<void>;
    signal(client: Socket, payload: {
        conversationId: string;
        senderRole: 'BUYER' | 'MERCHANT';
        senderId: string;
        data: any;
    }): Promise<void>;
    typing(client: Socket, payload: {
        conversationId: string;
        senderRole: 'BUYER' | 'MERCHANT';
    }): Promise<void>;
    read(client: Socket, payload: {
        conversationId: string;
        latestMessageId: string;
    }): Promise<void>;
}
