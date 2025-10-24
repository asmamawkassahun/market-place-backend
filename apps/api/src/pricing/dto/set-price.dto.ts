import { IsInt, IsString } from 'class-validator';

export class SetPriceDto {
  @IsString()
  skuId: string;
  @IsInt()
  amount: number;
  @IsString()
  currency: string;
}


