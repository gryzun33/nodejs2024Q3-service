import { IsDefined, IsString } from 'class-validator';

export class CreateUserDto {
  @IsDefined({ message: 'Login is required' })
  @IsString({ message: 'Login should be string' })
  login: string;

  @IsDefined({ message: 'Password is required' })
  password: string;
}
