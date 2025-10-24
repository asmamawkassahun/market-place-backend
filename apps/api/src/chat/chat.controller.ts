import { Body, Controller, Get, Param, Post, Query, UseGuards, Patch, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { IsString } from 'class-validator';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService, private storage: StorageService) {}

  @Post('conversations/:merchantId')
  createConversation(@CurrentUser() user: any, @Param('merchantId') merchantId: string) {
    return this.service.getOrCreateConversation(user.userId, merchantId);
  }

  @Get('conversations/:conversationId/messages')
  listMessages(@Param('conversationId') conversationId: string) {
    return this.service.listMessages(conversationId);
  }

  @Get('conversations/:conversationId/search')
  search(@Param('conversationId') conversationId: string, @Query('q') q: string) {
    return this.service.searchMessages(conversationId, q);
  }

  @Post('conversations/:conversationId/read/:latestMessageId')
  markRead(@Param('conversationId') conversationId: string, @Param('latestMessageId') latestMessageId: string) {
    return this.service.markRead(conversationId, latestMessageId);
  }

  @Post('messages/:messageId/report')
  report(@CurrentUser() user: any, @Param('messageId') messageId: string, @Body('reason') reason: string) {
    return this.service.reportMessage(user.userId, messageId, reason);
  }

  @Get('admin/reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  listReports() {
    return this.service.listReports();
  }

  @Patch('admin/reports/:reportId/resolve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  resolveReport(@Param('reportId') reportId: string) {
    return this.service.resolveReport(reportId);
  }

  @Get('ice')
  iceServers() {
    const stun = process.env.STUN_URL || 'stun:stun.l.google.com:19302';
    const turn = process.env.TURN_URL;
    const username = process.env.TURN_USERNAME;
    const credential = process.env.TURN_CREDENTIAL;
    const iceServers: any[] = [{ urls: stun }];
    if (turn && username && credential) {
      iceServers.push({ urls: turn, username, credential });
    }
    return { iceServers };
  }

  @Post('conversations/:conversationId/invites')
  createInvite(@CurrentUser() user: any, @Param('conversationId') conversationId: string) {
    return this.service.createInvite(conversationId, user.userId);
  }

  @Post('invites/:token/redeem')
  redeem(@CurrentUser() user: any, @Param('token') token: string) {
    return this.service.redeemInvite(token, user.userId);
  }

  @Post('conversations/:conversationId/attachments')
  @UseInterceptors(FilesInterceptor('files'))
  async upload(@Param('conversationId') conversationId: string, @UploadedFiles() files: any[]) {
    const urls: string[] = [];
    for (const file of files ?? []) {
      const key = `chat/${conversationId}/${Date.now()}-${file.originalname}`;
      const { url } = await this.storage.upload(key, file.buffer, file.mimetype);
      urls.push(url);
    }
    // Create a message referencing attachments (as buyer perspective by default)
    await this.service.sendAttachments(conversationId, 'BUYER', 'unknown', urls);
    return { attachments: urls };
  }
}


