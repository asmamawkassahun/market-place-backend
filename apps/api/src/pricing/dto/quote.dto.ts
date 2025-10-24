import { IsArray, IsString } from 'class-validator';

export class QuoteDto {
  @IsArray()
  skuIds: string[];
  @IsString()
  currency: string;
}


