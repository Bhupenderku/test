import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';

@Injectable()
export class OTPService {
  private readonly otpValidityDuration = 5 * 60 * 1000; // OTP validity duration (5 minutes)

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Generate a random OTP
  generateOTP(length: number): string {
    return crypto.randomInt(0, 10 ** length).toString().padStart(length, '0');
  }

  // Store OTP in the database with expiration time
  async storeOtp(email: string, otp: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    user.otp = otp;
    user.otpExpiration = new Date(Date.now() + this.otpValidityDuration);
    await this.userRepository.save(user);
  }

  // Verify the OTP and check if it has expired
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const isOtpValid = user.otp === otp && user.otpExpiration > new Date();
    if (isOtpValid) {
      user.otp = null;
      user.otpExpiration = null;
      await this.userRepository.save(user);
    }
    return isOtpValid;
  }
}
