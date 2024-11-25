import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: LoginUserDto) {
    const { login, password } = body;
    return await this.authService.signup(login, password);
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const { login, password } = body;
    const tokens = await this.authService.login(login, password);
    return tokens;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    const tokens = await this.authService.refresh(refreshToken);

    return tokens;
  }
}
