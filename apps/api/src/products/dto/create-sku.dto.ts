import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { UnitType } from '@prisma/client';

export class CreateSkuDto {
  @IsString()
  name: string;
  @IsEnum(UnitType)
  unitType: UnitType;
  @IsNumber()
  unitIncrement: number;
  @IsOptional()
  @IsNumber()
  packageSize?: number;
  @IsInt()
  pricePerCanonicalUnit: number;
  @IsOptional()
  @IsString()
  currency?: string;
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}


