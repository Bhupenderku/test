import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'WJ28@krhps',
      database: 'chatapp',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    OtpModule,
  
    
  ],
})
export class AppModule {}
