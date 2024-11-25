import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel: number;
  private logDir: string;
  private maxFileSize: number;
  private currentLogFile: string = 'app.log';

  private static readonly LOG_LEVELS = {
    log: 0,
    warn: 1,
    error: 2,
    debug: 3,
    verbose: 4,
  };

  constructor(private readonly configService: ConfigService) {
    const level = this.configService.get<string>('LOG_LEVEL') || '2';
    this.logLevel = parseInt(level, 10);
    this.logDir = this.configService.get<string>('LOG_DIR') || 'logs';
    this.maxFileSize =
      Number(this.configService.get<string>('LOG_MAX_FILE_SIZE')) || 256;
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
    const logFilePath = path.join(this.logDir, this.currentLogFile);
    this.rotateLogFileIfNeeded(logFilePath);
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage);
  }

  private rotateLogFileIfNeeded(filePath: string) {
    const fileSize = this.getFileSize(filePath);
    // console.log('filesize=', fileSize);
    if (fileSize > this.maxFileSize) {
      const newFilePath = this.getRotatedLogFilePath(filePath);
      fs.renameSync(filePath, newFilePath);
      this.currentLogFile = 'app.log';
    }
  }

  private getRotatedLogFilePath(filePath: string): string {
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const extIndex = filePath.lastIndexOf('.');
    const baseName = filePath.substring(0, extIndex);
    const extension = filePath.substring(extIndex);
    return `${baseName}-${date}${extension}`;
  }

  private getFileSize(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size / 1024;
    } catch (err) {
      return 0;
    }
  }
}
