import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class MarkPurchasedDto {
  @IsString()
  purchasedBy: string; // User ID who purchased

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantityPurchased?: number;
}
