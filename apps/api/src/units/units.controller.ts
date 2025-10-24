import { Controller, Get, Query } from '@nestjs/common';
import { UnitsService } from './units.service';

@Controller('units')
export class UnitsController {
  constructor(private readonly service: UnitsService) {}

  @Get('per-unit-display')
  perUnitDisplay(@Query('unit') unit: string, @Query('ppcu') ppcu: string) {
    return { display: this.service.perUnitPriceDisplay(unit as any, Number(ppcu)) };
  }
}


