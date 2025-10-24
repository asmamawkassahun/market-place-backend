import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from '../notifications/notifications.module';
import { StorageModule } from '../storage/storage.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatCleanup } from './chat.cleanup';

@Module({
  imports: [JwtModule.register({}), NotificationsModule, StorageModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ChatCleanup],
  exports: [ChatService],
})
export class ChatModule {}


