import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
// import { GetUserByIdDto } from './dto/getUserById.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): UserResponse[] {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): UserResponse {
    return this.userService.findUserById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): UserResponse {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): UserResponse {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.userService.deleteUser(id);
  }
}
