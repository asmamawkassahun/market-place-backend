import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class AddWishlistItemDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  skuId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
