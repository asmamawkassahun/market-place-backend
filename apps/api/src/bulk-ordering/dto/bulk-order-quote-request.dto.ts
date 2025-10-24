import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QuoteItemDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  skuId?: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class BulkOrderQuoteRequestDto {
  @IsString()
  merchantId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items: QuoteItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
