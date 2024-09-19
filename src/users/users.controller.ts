import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { OTPService } from './otp.service'; // Ensure OTPService is implemented
import { CreateUserDto } from './dto/create-user.dto';
import { OtpDto } from './dto/otp.dto'; // Ensure OtpDto is implemented

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OTPService, // Inject OTP service
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    // Register the user
    const user = await this.usersService.register(createUserDto);

    // Generate and store OTP
    const otp = this.otpService.generateOTP(6); // Generate a 6-digit OTP
    await this.otpService.storeOtp(user.email, otp);

    // Optionally, send OTP to the user's email or SMS here

    return { message: 'User registered successfully. Please check your email for OTP.' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    const { email, otp } = otpDto;

    // Verify the OTP
    const isValid = await this.otpService.verifyOtp(email, otp);

    if (isValid) {
      // Optionally, update user verification status
      await this.usersService.updateUserVerificationStatus(email);
      return { message: 'OTP verified successfully.' };
    } else {
      return { message: 'Invalid OTP or OTP has expired.' };
    }
  }
}
