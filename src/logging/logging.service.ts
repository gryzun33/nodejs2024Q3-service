import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel: string;
  private logDir: string;
  private maxFileSize: number;

  constructor(private readonly configService: ConfigService) {
    this.logLevel = this.configService.get<string>('LOG_LEVEL') || 'verbose';
    this.logDir = this.configService.get<string>('LOG_DIR') || 'logs';
    this.maxFileSize = 10 * 1024 * 1024;
    this.isLogDirectoryExists();
  }

  private isLogDirectoryExists() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  log(message: string) {
    if (this.shouldLog('log')) {
      console.log(message);
      this.writeToFile(message);
    }
  }

  error(message: string, trace?: string) {
    if (this.shouldLog('error')) {
      console.error(`${message}\nTrace: ${trace}`);
      this.writeToFile(`${message}\nTrace: ${trace}`);
    }
  }

  warn(message: string) {
    if (this.shouldLog('warn')) {
      console.warn(message);
      this.writeToFile(message);
    }
  }

  debug(message: string) {
    if (this.shouldLog('debug')) {
      console.debug(message);
      this.writeToFile(message);
    }
  }

  verbose(message: string) {
    if (this.shouldLog('verbose')) {
      console.info(message);
      this.writeToFile(message);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['log', 'warn', 'error', 'debug', 'verbose'];
    const levelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= levelIndex;
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
    if (fileSize > this.maxFileSize) {
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
