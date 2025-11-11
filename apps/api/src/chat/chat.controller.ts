import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { ChatService } from './chat.service';
import { PusherService } from './pusher.service';
import { SendMessageDto, MarkReadDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private pusherService: PusherService,
  ) {}

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  async getConversations(@CurrentUser() user: any) {
    const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
    console.log(`[ChatController] getConversations called - role: ${role}, userId: ${user.userId}, email: ${user.email}`);
    const conversations = await this.chatService.getConversations(user.userId, role);
    console.log(`[ChatController] getConversations result - role: ${role}, userId: ${user.userId}, count: ${conversations.length}`);
    if (role === 'MERCHANT' && conversations.length === 0) {
      console.warn(`[ChatController] Merchant ${user.userId} has no conversations - this might indicate no merchant record exists or no conversations have been created`);
    }
    return { data: conversations }; // Wrap in data object for consistency
  }

  @Post('conversations')
  @UseGuards(JwtAuthGuard)
  async createConversation(@CurrentUser() user: any, @Body() body: { merchantId: string }) {
    return this.chatService.getOrCreateConversation(
      user.userId,
      body.merchantId,
    );
  }

  @Get('conversations/:id/messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Param('id') id: string, @CurrentUser() user: any) {
    const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
    return this.chatService.getMessages(id, user.userId, role);
  }

  @Post('conversations/:id/messages')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
    @CurrentUser() user: any,
  ) {
    const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
    return this.chatService.sendMessage(id, user.userId, role, dto);
  }

  // Allow sending message with just merchantId (creates conversation if needed)
  @Post('messages')
  @UseGuards(JwtAuthGuard)
  async sendMessageToMerchant(
    @Body() body: SendMessageDto & { merchantId?: string },
    @CurrentUser() user: any,
  ) {
    if (!body.merchantId) {
      return { error: 'Merchant ID is required' };
    }

    // Create or get conversation
    const conversation = await this.chatService.getOrCreateConversation(
      user.userId,
      body.merchantId,
    );

    // Send the message
    const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
    return this.chatService.sendMessage(conversation.id, user.userId, role, {
      content: body.content,
      type: body.type,
      attachments: body.attachments,
    });
  }

  @Post('conversations/:id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(
    @Param('id') conversationId: string,
    @Body() dto: MarkReadDto,
    @CurrentUser() user: any,
  ) {
    const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
    return this.chatService.markAsRead(
      conversationId,
      dto.messageId,
      user.userId,
      role,
    );
  }

  // Test route to verify routing works
  @Get('pusher-test')
  async testPusherRoute() {
    console.log('[ChatController] Test route called - routing is working!');
    return { message: 'Pusher route test - route is accessible', timestamp: new Date().toISOString() };
  }

  @Post('pusher-auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async authenticatePusher(@Req() req: any, @Res() res: Response, @CurrentUser() user: any) {
    // Pusher sends data as form-encoded (application/x-www-form-urlencoded) or JSON
    // Handle both formats - check body first, then query params as fallback
    const socketId = req.body?.socket_id || req.query?.socket_id || req.body?.socketId;
    const channelName = req.body?.channel_name || req.query?.channel_name || req.body?.channelName;
    
    console.log('[Pusher Auth] Raw request:', {
      method: req.method,
      url: req.url,
      path: req.path,
      originalUrl: req.originalUrl,
      body: req.body,
      query: req.query,
      contentType: req.headers['content-type'],
    });

    console.log('[Pusher Auth] Request received:', { 
      method: req.method,
      url: req.url,
      originalUrl: req.originalUrl,
      path: req.path,
      socketId, 
      channelName, 
      userId: user?.userId, 
      role: user?.role,
      headers: {
        authorization: req.headers.authorization ? 'present' : 'missing',
      }
    });

    if (!socketId || !channelName) {
      console.error('[Pusher Auth] Missing socket_id or channel_name');
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Missing socket_id or channel_name' });
    }

    if (!user || !user.userId) {
      console.error('[Pusher Auth] User not authenticated');
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Not authenticated' });
    }

    try {
      // Verify user has access to this channel
      if (channelName.startsWith('private-conversation-')) {
        const conversationId = channelName.replace('private-conversation-', '');
        console.log('[Pusher Auth] Authenticating conversation channel:', conversationId);
        
        const conversation = await this.chatService.getConversationById(conversationId);
        
        if (!conversation) {
          console.error('[Pusher Auth] Conversation not found:', conversationId);
          return res.status(HttpStatus.FORBIDDEN).json({ error: 'Conversation not found' });
        }

        const role = user.role === 'MERCHANT' ? 'MERCHANT' : 'USER';
        const merchantOwnerId = await this.chatService.getMerchantOwnerId(conversation.merchantId);
        
        console.log('[Pusher Auth] Access check:', {
          role,
          userId: user.userId,
          conversationUserId: conversation.userId,
          merchantOwnerId,
        });
        
        // Check if user has access
        const hasAccess = 
          (role === 'USER' && conversation.userId === user.userId) ||
          (role === 'MERCHANT' && merchantOwnerId === user.userId);

        if (!hasAccess) {
          console.error('[Pusher Auth] Access denied for conversation:', conversationId);
          return res.status(HttpStatus.FORBIDDEN).json({ error: 'Access denied' });
        }

        // Authenticate the private channel
        const auth = this.pusherService.authenticatePrivate(socketId, channelName);
        console.log('[Pusher Auth] ✅ Successfully authenticated conversation channel:', conversationId);
        return res.status(HttpStatus.OK).json(auth);
      }

      if (channelName.startsWith('private-user-')) {
        const channelUserId = channelName.replace('private-user-', '');
        console.log('[Pusher Auth] Authenticating user channel:', channelUserId);
        
        // Users can only subscribe to their own private channel
        if (channelUserId !== user.userId) {
          console.error('[Pusher Auth] Access denied - user mismatch:', { channelUserId, userId: user.userId });
          return res.status(HttpStatus.FORBIDDEN).json({ error: 'Access denied' });
        }

        // For private-user channels, we can use presence or just private
        // Let's use private channel authentication (not presence)
        const auth = this.pusherService.authenticatePrivate(socketId, channelName);
        console.log('[Pusher Auth] ✅ Successfully authenticated user channel:', channelUserId);
        return res.status(HttpStatus.OK).json(auth);
      }

      console.error('[Pusher Auth] Invalid channel name:', channelName);
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid channel name' });
    } catch (error: any) {
      console.error('[Pusher Auth] Exception during authentication:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Authentication failed' });
    }
  }
}

