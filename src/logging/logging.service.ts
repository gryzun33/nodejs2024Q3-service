import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel: string;

  constructor(private readonly configService: ConfigService) {
    this.logLevel = this.configService.get<string>('LOG_LEVEL') || 'verbose';
  }

  log(message: string) {
    if (this.shouldLog('log')) {
      console.log(message);
    }
  }

  error(message: string, trace: string) {
    if (this.shouldLog('error')) {
      console.error(`${message}\nTrace: ${trace}`);
    }
  }

  warn(message: string) {
    if (this.shouldLog('warn')) {
      console.warn(message);
    }
  }

  debug(message: string) {
    if (this.shouldLog('debug')) {
      console.debug(message);
    }
  }

  verbose(message: string) {
    if (this.shouldLog('verbose')) {
      console.info(message);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['log', 'warn', 'error', 'debug', 'verbose'];
    const levelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= levelIndex;
  }
}
