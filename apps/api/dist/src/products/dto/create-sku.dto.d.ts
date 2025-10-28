import { UnitType } from '@prisma/client';
export declare class CreateSkuDto {
    name: string;
    unitType: UnitType;
    unitIncrement: number;
    packageSize?: number;
    pricePerCanonicalUnit: number;
    currency?: string;
    active?: boolean;
}
