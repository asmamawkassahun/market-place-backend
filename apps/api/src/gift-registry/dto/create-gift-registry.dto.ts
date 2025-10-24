import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateGiftRegistryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
