import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserResponse } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map();

  createUser(createUserDto: CreateUserDto): UserResponse {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.set(newUser.id, newUser);

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  findAllUsers(): UserResponse[] {
    return Array.from(this.users.values()).map((user) => {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      return userWithoutPassword;
    });
  }

  findUserById(id: string): UserResponse {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User not found.`);
    }
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): UserResponse {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;
    user.updatedAt = Date.now();
    user.version += 1;

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  deleteUser(id: string): void {
    const result = this.users.delete(id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }
}
