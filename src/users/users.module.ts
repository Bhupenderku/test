import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { OTPService } from './otp.service'; // Import OTPService

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, OTPService], // Add OTPService to providers
  controllers: [UsersController],
})
export class UsersModule {}
