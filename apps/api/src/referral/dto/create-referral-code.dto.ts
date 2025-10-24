import { IsString, IsOptional, IsNumber, Min, IsIn } from 'class-validator';

export class CreateReferralCodeDto {
  @IsOptional()
  @IsString()
  code?: string; // Custom code, if not provided will be auto-generated

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUses?: number;

  @IsOptional()
  @IsString()
  @IsIn(['points', 'discount', 'credit'])
  rewardType?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  rewardValue?: number;

  @IsOptional()
  @IsString()
  expiresAt?: string; // ISO date string
}
