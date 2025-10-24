import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CreateAddressDto } from './dto/create-address.dto';

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly service: AddressesService) {}

  @Get()
  list(@CurrentUser() user: any) { return this.service.list(user.userId); }

  @Post()
  create(@CurrentUser() user: any, @Body() body: CreateAddressDto) { return this.service.create(user.userId, body); }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.service.update(user.userId, id, body);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) { return this.service.remove(user.userId, id); }
}


