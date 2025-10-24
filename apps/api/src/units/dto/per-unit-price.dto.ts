import { IsNumber, IsString } from 'class-validator';

export class PerUnitPriceDto {
  @IsString()
  skuId: string;
  @IsNumber()
  amount: number;
  @IsString()
  currency: string;
}


