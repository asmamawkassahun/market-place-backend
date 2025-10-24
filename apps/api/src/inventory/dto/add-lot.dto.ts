import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddLotDto {
  @IsString()
  skuId: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsDateString()
  expiry?: string;
}


