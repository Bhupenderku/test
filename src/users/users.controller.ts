// user.controller.ts
import { Controller, Post, Body, BadRequestException, ConflictException } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { OTPService } from '../otp/services/otp.service';
import { CreateUserDto } from './dto/create-user.dto';
import { OtpDto } from '../otp/dto/otp.dto';
import { UserDetailsDto } from './dto/user-details.dto';
import { JwtService } from '../jwt/jwt.service'; // Import the JWT service
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OTPService,
    private readonly jwtService: JwtService, // Inject the JWT service
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersService.register(createUserDto);
    const otp = await this.otpService.generateAndStoreOtp(user.email);
    return { message: 'User registered. Check your email for OTP.', otp };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    const isValid = await this.otpService.verifyOtp(otpDto.email, otpDto.otp);
    if (isValid) {
      await this.usersService.updateUserVerificationStatus(otpDto.email);
      return { message: 'OTP verified successfully.' };
    } else {
      throw new BadRequestException('Invalid or expired OTP.');
    }
  }

  @Post('details')
  async addUserDetails(
    @Body('email') email: string, 
    @Body() userDetailsDto: UserDetailsDto
  ) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isVerified) {
      throw new BadRequestException('User not found or not verified');
    }
  
    const details = await this.usersService.addUserDetails(user.email, userDetailsDto);
    return { message: 'User details added successfully', details };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    // Generate and return JWT token
    const token = this.jwtService.generateToken(user.email);
    return { message: 'Login successful', token, user: { email: user.email, isVerified: user.isVerified } };
  }
}
