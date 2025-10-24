import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreatePriceAlertDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  skuId?: string;

  @IsNumber()
  @Min(1)
  targetPrice: number; // ETB*100
}
