import { IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;
}


