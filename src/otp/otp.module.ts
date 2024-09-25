import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTPService } from './services/otp.service';
import { Otp } from './entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  providers: [OTPService],
  exports: [OTPService],
})
export class OtpModule {}
