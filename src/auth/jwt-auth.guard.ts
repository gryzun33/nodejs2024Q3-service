import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // console.log('GUARD');
    const request = context.switchToHttp().getRequest();

    const { url } = request;

    const excludedPaths = ['/auth/login', '/auth/signup', '/doc', '/'];
    if (excludedPaths.includes(url)) {
      return true;
    }

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Authorization header is invalid or does not follow Bearer scheme',
      );
    }

    try {
      const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
      const decoded = this.jwtService.verify(token, { secret });

      request.user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Access token is invalid or has expired');
    }
  }
}
