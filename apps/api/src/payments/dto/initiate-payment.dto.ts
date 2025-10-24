import { IsInt, IsString } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  orderId: string;
  @IsString()
  provider: string;
  @IsInt()
  amount: number;
}


