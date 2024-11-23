import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from 'src/logging/logging.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      status === 500 ? 'Internal Server Error' : (exception as any).message;

    const stack = exception instanceof Error ? exception.stack : '';

    this.loggingService.error(
      `Exception: ${message} on ${request.method} ${request.originalUrl}`,
      stack,
    );

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
