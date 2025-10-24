import { IsString, IsOptional } from 'class-validator';

export class CreateStockNotificationDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  skuId?: string;
}
