import { IsString, IsOptional, IsNumber, Min, IsIn } from 'class-validator';

export class AddGiftRegistryItemDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  skuId?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  @IsIn(['high', 'medium', 'low'])
  priority?: string;
}
