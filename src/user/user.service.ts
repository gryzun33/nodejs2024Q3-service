import { Injectable } from '@nestjs/common';
import { User, UserResponse } from './interfaces/user.interface';
import { CreateUserDto } from './dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

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

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  findAllUsers(): UserResponse[] {
    return Array.from(this.users.values()).map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  findUserById(id: string): UserResponse | undefined {
    const user = this.users.get(id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return undefined;
  }

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): UserResponse | undefined {
    const user = this.users.get(id);
    if (user) {
      if (user.password !== updatePasswordDto.oldPassword) {
        throw new Error('Old password is incorrect');
      }

      user.password = updatePasswordDto.newPassword;
      user.updatedAt = Date.now();
      user.version += 1;

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return undefined;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }
}
