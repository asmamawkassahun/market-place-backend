import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  constructor(private chat: ChatService, private jwt: JwtService) {}

  handleConnection(client: Socket) {
    // Expect JWT in query or headers for basic identification
    const token = (client.handshake.auth?.token as string) || (client.handshake.query?.token as string) || (client.handshake.headers['authorization'] as string)?.replace('Bearer ', '');
    if (!token) return client.disconnect();
    try {
      const payload: any = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'dev_secret' });
      (client as any).user = { userId: payload.sub, role: payload.role };
    } catch (e) {
      return client.disconnect();
    }
  }

  @SubscribeMessage('join')
  async join(client: Socket, payload: { conversationId: string }) {
    await client.join(payload.conversationId);
    client.emit('joined', { conversationId: payload.conversationId });
  }

  @SubscribeMessage('text')
  async text(client: Socket, payload: { conversationId: string; senderRole: 'BUYER'|'MERCHANT'; senderId: string; content: string }) {
    const msg = await this.chat.sendText(payload.conversationId, payload.senderRole, payload.senderId, payload.content);
    this.server.to(payload.conversationId).emit('message', msg);
  }

  @SubscribeMessage('signal')
  async signal(client: Socket, payload: { conversationId: string; senderRole: 'BUYER'|'MERCHANT'; senderId: string; data: any }) {
    const msg = await this.chat.sendSignal(payload.conversationId, payload.senderRole, payload.senderId, payload.data);
    this.server.to(payload.conversationId).emit('signal', msg);
  }

  @SubscribeMessage('typing')
  async typing(client: Socket, payload: { conversationId: string; senderRole: 'BUYER'|'MERCHANT' }) {
    this.server.to(payload.conversationId).emit('typing', { role: payload.senderRole });
  }

  @SubscribeMessage('read')
  async read(client: Socket, payload: { conversationId: string; latestMessageId: string }) {
    await this.chat.markRead(payload.conversationId, payload.latestMessageId);
    this.server.to(payload.conversationId).emit('read', { latestMessageId: payload.latestMessageId });
  }
}


