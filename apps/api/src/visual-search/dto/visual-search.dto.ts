import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class VisualSearchDto {
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;
}
