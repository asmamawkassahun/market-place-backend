import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.service.findOne(user.userId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}


