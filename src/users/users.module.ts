// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserDetails } from './entities/user-details.entity';
import { OTPService } from '../otp/services/otp.service'; 
import { Otp } from '../otp/entities/otp.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '../jwt/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDetails, Otp]),
    JwtModule.register({
      secret: 'your_secret_key', // Use a more secure secret in production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersService, OTPService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}
