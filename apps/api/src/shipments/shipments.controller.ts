import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { ConfirmShipmentDto } from './dto/confirm-shipment.dto';

@UseGuards(JwtAuthGuard)
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly service: ShipmentsService) {}

  @Post('create/:orderId')
  create(@Param('orderId') orderId: string) {
    return this.service.create(orderId);
  }

  @Post('confirm/:shipmentId')
  confirm(@Param('shipmentId') shipmentId: string, @Body() body: ConfirmShipmentDto) {
    return this.service.confirmDelivery(shipmentId, body.otp);
  }
}


