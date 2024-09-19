import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';
import { Match } from '../../common/custom-validators'; // Create a custom validator for matching passwords

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  @ValidateIf(o => o.password) // Validate if password is present
  @Match('password') // Custom decorator
  confirmPassword: string;
}
