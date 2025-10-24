import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class EscrowDto {
  @IsString()
  paymentId: string;
  @IsInt()
  holdAmount: number;
}

export class DisputeDto {
  @IsString()
  reason: string;
}

export class ReleaseDto {
  @IsOptional()
  @IsNumber()
  amount?: number;
}

export class RefundDto {
  @IsOptional()
  @IsNumber()
  amount?: number;
}


