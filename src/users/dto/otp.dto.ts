import { IsString, IsNotEmpty } from 'class-validator';

export class OtpDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
