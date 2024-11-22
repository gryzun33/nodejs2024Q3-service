import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
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
  async refresh(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [scheme, refreshToken] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !refreshToken) {
      throw new UnauthorizedException(
        'Authorization header is invalid or does not follow Bearer scheme',
      );
    }

    const tokens = await this.authService.refresh(refreshToken);

    return tokens;
  }
}
