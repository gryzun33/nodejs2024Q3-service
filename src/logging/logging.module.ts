import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
