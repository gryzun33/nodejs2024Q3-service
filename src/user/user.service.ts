import { Injectable } from '@nestjs/common';
import { User, UserResponse } from './interfaces/user.interface';
import { CreateUserDto } from './dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  createUser(createUserDto: CreateUserDto): UserResponse {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  findAllUsers(): UserResponse[] {
    return this.users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  findUserById(id: string): UserResponse | undefined {
    const user = this.users.find((user) => user.id === id);
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
    const user = this.users.find((user) => user.id === id);
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
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }
}
