import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { OTPService } from '../otp/services/otp.service'; // OTPService Module
import { Otp } from '../otp/entities/otp.entity'; // OTP Entity

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp])], // Add both User and Otp entities
  providers: [UsersService, OTPService], // Add OTPService as a provider
  controllers: [UsersController],
})
export class UsersModule {}
