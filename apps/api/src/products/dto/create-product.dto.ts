import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSku {
  @IsString()
  name: string;

  @IsString()
  unitType: string;

  @IsOptional()
  @IsNumber()
  unitIncrement?: number;

  @IsOptional()
  @IsNumber()
  packageSize?: number;

  @IsOptional()
  @IsNumber()
  pricePerCanonicalUnit?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  skus?: CreateSku[];
}

