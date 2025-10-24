import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  merchantId: string;
  @IsOptional()
  @IsString()
  addressId?: string;
  @IsArray()
  itemSkuIds: string[];
  @IsInt()
  totalAmount: number;
}


