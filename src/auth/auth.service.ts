import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserAccess, UserResponse } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(login: string, password: string): Promise<UserResponse> {
    const hashedPassword = await this.hashPassword(password);
    const createUserDto = {
      login,
      password: hashedPassword,
    };

    return this.userService.createUser(createUserDto);
  }

  async login(login: string, password: string): Promise<any> {
    const user = await this.userService.getUserByLogin(login);

    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Authentication failed');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  generateAccessToken(user: UserAccess): string {
    const secret = this.configService.get<string>('JWT_SECRET_KEY');
    const expiresIn = this.configService.get<string>('TOKEN_EXPIRE_TIME');

    return this.jwtService.sign(
      { userId: user.id, login: user.login },
      { secret, expiresIn },
    );
  }

  generateRefreshToken(user: UserAccess): string {
    const refreshSecret = this.configService.get<string>(
      'JWT_SECRET_REFRESH_KEY',
    );
    const expiresIn = this.configService.get<string>(
      'TOKEN_REFRESH_EXPIRE_TIME',
    );

    return this.jwtService.sign(
      { userId: user.id, login: user.login },
      { secret: refreshSecret, expiresIn },
    );
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      });

      const user = { id: decoded.userId, login: decoded.login };

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('CRYPT_SALT');
    const salt = await bcrypt.genSalt(Number(saltRounds));
    return await bcrypt.hash(password, salt);
  }
}
