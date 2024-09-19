import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // For password hashing
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create a new user
    const user = new User();
    user.email = createUserDto.email;
    user.password = hashedPassword; // Store hashed password

    // Save user to the database
    const savedUser = await this.usersRepository.save(user);

    // Optionally, generate and store OTP (not in this method)
    
    return savedUser;
  }

  async updateUserVerificationStatus(email: string): Promise<void> {
    // Find the user by email
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's verification status (example field)
    user.isVerified = true; // Assuming there's an 'isVerified' field in User entity
    await this.usersRepository.save(user);
  }

  // Additional methods for user operations can be added here
}
