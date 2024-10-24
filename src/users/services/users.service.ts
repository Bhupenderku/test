// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDetails } from '../entities/user-details.entity';
import { UserDetailsDto } from '../dto/user-details.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({ email: createUserDto.email, password: hashedPassword });
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email }, relations: ['details'] });
  }

  async updateUserVerificationStatus(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (user) {
      user.isVerified = true;
      await this.userRepository.save(user);
    }
  }

  async addUserDetails(email: string, userDetailsDto: UserDetailsDto): Promise<UserDetails> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userDetails = this.userDetailsRepository.create({
      firstName: userDetailsDto.firstName,
      lastName: userDetailsDto.lastName,
      gender: userDetailsDto.gender,
      photo: userDetailsDto.photo,
      user: user,
    });

    return await this.userDetailsRepository.save(userDetails);
  }
}
