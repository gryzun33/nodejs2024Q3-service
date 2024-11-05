import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User, UserResponse } from './interfaces/user.interface';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): UserResponse[] {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string): UserResponse | undefined {
    return this.userService.findUserById(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): UserResponse {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): UserResponse | undefined {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): string {
    const result = this.userService.deleteUser(id);
    if (result) {
      return `User with id ${id} has been deleted successfully.`;
    } else {
      return `User with id ${id} not found.`;
    }
  }
}
