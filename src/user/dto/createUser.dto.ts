import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Login is required' })
  login: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
