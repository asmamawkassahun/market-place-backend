import { IsString, IsOptional } from 'class-validator';

export class UseReferralCodeDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  orderId?: string;
}
