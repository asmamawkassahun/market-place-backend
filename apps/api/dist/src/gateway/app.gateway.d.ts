import { OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class AppGateway implements OnGatewayConnection {
    server: Server;
    handleConnection(): void;
}
