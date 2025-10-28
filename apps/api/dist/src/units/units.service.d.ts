type Unit = 'PIECE' | 'KG' | 'LITER' | 'METER';
export declare class UnitsService {
    toCanonical(unit: Unit, value: number): number;
    fromCanonical(unit: Unit, value: number): number;
    perUnitPriceDisplay(unit: Unit, pricePerCanonicalUnit: number): string;
}
export {};
