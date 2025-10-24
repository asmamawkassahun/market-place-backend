import { Injectable } from '@nestjs/common';

type Unit = 'PIECE'|'KG'|'LITER'|'METER';

@Injectable()
export class UnitsService {
  toCanonical(unit: Unit, value: number) { return value; }
  fromCanonical(unit: Unit, value: number) { return value; }

  perUnitPriceDisplay(unit: Unit, pricePerCanonicalUnit: number) {
    return `${(pricePerCanonicalUnit/100).toFixed(2)} ETB/${unit.toLowerCase()}`;
  }
}


