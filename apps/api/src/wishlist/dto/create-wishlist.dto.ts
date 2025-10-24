import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
