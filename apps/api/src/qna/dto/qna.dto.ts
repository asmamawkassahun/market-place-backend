import { IsOptional, IsString } from 'class-validator';

export class QnaDto {
  @IsString()
  question: string;

  @IsOptional()
  @IsString()
  answer?: string;
}


