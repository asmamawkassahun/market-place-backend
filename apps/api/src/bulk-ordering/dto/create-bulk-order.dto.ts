import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkOrderItemDto {
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
}

export class CreateBulkOrderDto {
  @IsString()
  merchantId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkOrderItemDto)
  items: BulkOrderItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
