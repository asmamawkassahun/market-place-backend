import { IsInt, IsString } from 'class-validator';

export class RequestPayoutDto {
  @IsString()
  method: string;
  @IsString()
  accountRef: string;
  @IsInt()
  amount: number;
}


