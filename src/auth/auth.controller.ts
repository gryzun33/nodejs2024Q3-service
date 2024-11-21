import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: LoginUserDto) {
    const { login, password } = body;
    await this.authService.signup(login, password);
    return { message: 'User created successfully' };
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const { login, password } = body;
    const tokens = await this.authService.login(login, password);
    return tokens;
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    const tokens = await this.authService.refresh(refreshToken);
    return tokens;
  }
}
