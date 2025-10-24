import { IsNumber, Min } from 'class-validator';

export class JoinGroupBuyDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}
