import { IsNumber, IsString } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  skuId: string;

  @IsNumber()
  quantity: number;
}


