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
import { User, UserResponse } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all users.',
    type: [UserResponse],
  })
  findAll(): UserResponse[] {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user.',
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): UserResponse {
    return this.userService.findUserById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input.' })
  create(@Body() createUserDto: CreateUserDto): UserResponse {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: 200,
    description: 'Password successfully updated.',
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID or bad input.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Old password is wrong.' })
  updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): UserResponse {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Invalid UUID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.userService.deleteUser(id);
  }
}
