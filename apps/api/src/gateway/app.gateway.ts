import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  handleConnection() {}
}


