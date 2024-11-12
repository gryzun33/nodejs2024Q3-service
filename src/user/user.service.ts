import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
// import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma.service';
import { UserRepository } from './user.repository';
import { UserResponse } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    try {
      const user = await this.userRepository.create(createUserDto);
      const userResponse = {
        ...user,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      };
      return userResponse;
    } catch (error) {
      console.log('ERRRRSERVICE');
      throw new ConflictException(error.message);
    }
  }

  async findAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();

    const usersResponse = users.map((user) => ({
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    }));

    return usersResponse;
  }

  async findUserById(id: string): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findById(id);
      // console.log('USER=', user);
      const userResponse = {
        ...user,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      };
      return userResponse;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findByIdWithPassword(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedData = {
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
    };

    const updatedUser = await this.userRepository.update(id, updatedData);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    const userResponse = {
      ...updatedUser,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
    return userResponse;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
  }
}
