import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'testuser',
    description: 'The login of the user',
  })
  @IsDefined({ message: 'Login is required' })
  @IsString({ message: 'Login should be string' })
  login: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsDefined({ message: 'Password is required' })
  @IsString({ message: 'Password should be string' })
  password: string;
}
