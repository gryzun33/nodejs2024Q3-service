import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdatedData } from './interfaces/updatedData';
import { UserLogin } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.create({
        data: {
          login: createUserDto.login,
          password: createUserDto.password,
        },
        select: {
          id: true,
          login: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('A user with this login already exists.');
      }
    }
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    try {
      return this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          login: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        console.log('errorinrepo');
        throw new NotFoundException('User not found');
      }
    }
  }

  async findByIdWithPassword(id: string): Promise<User> {
    try {
      return this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(
    id: string,
    updateData: UpdatedData,
  ): Promise<Omit<User, 'password'>> {
    try {
      return this.prisma.user.update({
        where: { id },
        data: {
          ...updateData,
        },
        select: {
          id: true,
          login: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async getUserByLogin(login: string): Promise<UserLogin> {
    return await this.prisma.user.findFirst({
      where: {
        login,
      },
      select: {
        id: true,
        login: true,
        password: true,
      },
    });
  }
}
