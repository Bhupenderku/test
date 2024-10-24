import { IsString, IsEmail,  IsOptional } from 'class-validator';

export class UserDetailsDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  gender: string;

  @IsString()
  @IsOptional()
  photo?: string;
}

