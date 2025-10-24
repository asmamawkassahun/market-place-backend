import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateInventoryMovementDto {
  @IsString()
  skuId: string;

  @IsString()
  @IsIn(['addition', 'removal', 'adjustment', 'transfer', 'sale', 'return'])
  type: string;

  @IsNumber()
  quantity: number; // positive for additions, negative for removals

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  referenceId?: string; // order ID, adjustment ID, etc.
}
