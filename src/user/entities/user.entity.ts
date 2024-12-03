import { ApiProperty, OmitType } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the user',
  })
  id: string;
  @ApiProperty({ example: 'testuser', description: 'The login of user' })
  login: string;
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: false,
  })
  password: string;
  @ApiProperty({
    example: 1,
    description: 'The version number of the user record',
  })
  version: number;
  @ApiProperty({
    example: 1627848273,
    description: 'Timestamp when the user was created',
  })
  createdAt: number;
  @ApiProperty({
    example: 1627848373,
    description: 'Timestamp when the user was last updated',
  })
  updatedAt: number;
}

export class UserResponse extends OmitType(User, ['password'] as const) {}

export type UserLogin = Omit<User, 'version' | 'createdAt' | 'updatedAt'>;

export type UserAccess = Omit<UserLogin, 'password'>;
