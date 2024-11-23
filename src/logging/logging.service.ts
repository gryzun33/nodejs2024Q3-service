import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel: number;
  private logDir: string;
  private maxFileSize: number;

  private static readonly LOG_LEVELS = {
    log: 0,
    warn: 1,
    error: 2,
    debug: 3,
    verbose: 4,
  };

  constructor(private readonly configService: ConfigService) {
    const level = this.configService.get<string>('LOG_LEVEL') || '0';
    this.logLevel = parseInt(level, 10);
    this.logDir = this.configService.get<string>('LOG_DIR') || 'logs';
    this.maxFileSize =
      Number(this.configService.get<string>('LOG_MAX_FILE_SIZE')) || 10240;
    this.isLogDirectoryExists();
  }

  private isLogDirectoryExists() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  log(message: string) {
    if (this.shouldLog(LoggingService.LOG_LEVELS.log)) {
      console.log(message);
      this.writeToFile(message);
    }
  }

  error(message: string, trace?: string) {
    if (this.shouldLog(LoggingService.LOG_LEVELS.error)) {
      console.error(`${message}\nTrace: ${trace}`);
      this.writeToFile(`${message}\nTrace: ${trace}`);
    }
  }

  warn(message: string) {
    if (this.shouldLog(LoggingService.LOG_LEVELS.warn)) {
      console.warn(message);
      this.writeToFile(message);
    }
  }

  debug(message: string) {
    if (this.shouldLog(LoggingService.LOG_LEVELS.debug)) {
      console.debug(message);
      this.writeToFile(message);
    }
  }

  verbose(message: string) {
    if (this.shouldLog(LoggingService.LOG_LEVELS.verbose)) {
      console.info(message);
      this.writeToFile(message);
    }
  }

  private shouldLog(level: number): boolean {
    return level <= this.logLevel;
  }

  private writeToFile(message: string) {
    const logFilePath = this.getLogFilePath();
    this.rotateLogFileIfNeeded(logFilePath);
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage);
  }

  private getLogFilePath(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `${date}-log.log`);
  }

  private rotateLogFileIfNeeded(filePath: string) {
    const fileSize = this.getFileSize(filePath);
    if (fileSize > this.maxFileSize * 1024) {
      const newFilePath = filePath.replace('.log', `-${Date.now()}.log`);
      fs.renameSync(filePath, newFilePath);
    }
  }

  private getFileSize(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (e) {
      return 0;
    }
  }
}
