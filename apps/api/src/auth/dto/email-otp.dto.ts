import { IsString, IsEmail } from 'class-validator';

export class RequestEmailOtpDto {
  @IsEmail()
  email: string;
}

export class VerifyEmailOtpDto {
  @IsEmail()
  email: string;
  @IsString()
  code: string;
}