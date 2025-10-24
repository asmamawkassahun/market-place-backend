import { IsString } from 'class-validator';

export class ConfirmShipmentDto {
  @IsString()
  otp: string;
}


