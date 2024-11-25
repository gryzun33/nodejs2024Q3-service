import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './authGuard/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoggingModule } from './logging/logging.module';
import { LoggingMiddleware } from './logging/logging.middleware';
import { LoggingService } from './logging/logging.service';

@Module({
  imports: [
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoritesModule,
    AuthModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string | number>('TOKEN_EXPIRE_TIME'),
        },
      }),
    }),
    LoggingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly loggingService: LoggingService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }

  onModuleInit() {
    process.on('uncaughtException', (err) => {
      this.loggingService.error(
        `Uncaught Exception: ${err.message}`,
        err.stack,
      );
    });

    process.on('unhandledRejection', (reason: any) => {
      if (reason instanceof Error) {
        this.loggingService.error(
          `Unhandled Rejection: ${reason.message}`,
          reason.stack,
        );
      } else {
        this.loggingService.error(`Unhandled Rejection: ${reason}`);
      }
    });
  }
}
