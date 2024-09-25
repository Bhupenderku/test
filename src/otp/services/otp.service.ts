import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from '../entities/otp.entity';
import * as crypto from 'crypto';

@Injectable()
export class OTPService {
  private readonly otpValidityDuration = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  async generateAndStoreOtp(email: string): Promise<string> {
    const otp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
    const expirationTime = new Date(Date.now() + this.otpValidityDuration);

    const newOtp = this.otpRepository.create({
      email,
      otp,
      expirationTime,
    });

    await this.otpRepository.save(newOtp);
    return otp;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpRecord = await this.otpRepository.findOne({ where: { email, otp } });
    if (!otpRecord) {
      return false;
    }

    if (otpRecord.expirationTime > new Date()) {
      await this.otpRepository.delete({ email }); // Optionally delete OTP after verification
      return true;
    }

    return false;
  }
}
