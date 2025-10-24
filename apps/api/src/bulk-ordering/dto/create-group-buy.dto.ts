import { IsString, IsOptional, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateGroupBuyDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  skuId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  targetQuantity: number;

  @IsNumber()
  @Min(1)
  pricePerUnit: number; // ETB*100

  @IsString()
  @IsDateString()
  startsAt: string;

  @IsString()
  @IsDateString()
  endsAt: string;
}
