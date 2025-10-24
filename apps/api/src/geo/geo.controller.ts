import { Controller, Get, Query } from '@nestjs/common';
import { GeoService } from './geo.service';

@Controller('geo')
export class GeoController {
  constructor(private readonly service: GeoService) {}

  @Get('nearby-merchants')
  nearby(@Query('lat') lat: string, @Query('lon') lon: string, @Query('radiusKm') radiusKm?: string) {
    return this.service.nearbyMerchants(Number(lat), Number(lon), radiusKm ? Number(radiusKm) : undefined);
  }
}


