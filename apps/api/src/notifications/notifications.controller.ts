import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('read') read?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.notificationsService.getNotifications(user.userId, {
      page: page || 1,
      limit: limit || 10,
      type,
      read,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc'
    });
  }

  @Get(':id')
  async getNotification(@CurrentUser() user: any, @Param('id') id: string) {
    return this.notificationsService.getNotification(user.userId, id);
  }

  @Patch(':id/read')
  async markAsRead(@CurrentUser() user: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(user.userId, id);
  }

  @Post('read-all')
  async markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.userId);
  }

  @Delete(':id')
  async deleteNotification(@CurrentUser() user: any, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(user.userId, id);
  }

  @Delete()
  async clearAllNotifications(@CurrentUser() user: any) {
    return this.notificationsService.clearAllNotifications(user.userId);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user.userId);
  }

  @Patch('preferences')
  async updatePreferences(@CurrentUser() user: any, @Body() preferences: any) {
    return this.notificationsService.updatePreferences(user.userId, preferences);
  }

  @Get('preferences')
  async getPreferences(@CurrentUser() user: any) {
    return this.notificationsService.getPreferences(user.userId);
  }
}












