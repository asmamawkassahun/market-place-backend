import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PusherService } from './pusher.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'dev_secret',
        signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '15m' },
      }),
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, PusherService],
  exports: [ChatService, PusherService],
})
export class ChatModule {}

