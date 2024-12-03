import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, query, body } = req;
    const startTime = Date.now();

    this.loggingService.log(
      `Request: [${method}] ${originalUrl} - Query: ${JSON.stringify(
        query,
      )} Body: ${JSON.stringify(body)}`,
    );

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const responseTime = Date.now() - startTime;
      this.loggingService.log(
        `Response: Status ${statusCode} - Time: ${responseTime}ms\n`,
      );
    });

    next();
  }
}

// @Injectable()
// export class LoggingMiddleware implements NestMiddleware {
//   constructor(private readonly loggingService: LoggingService) {}

//   async use(req: IncomingMessage, res: ServerResponse, next) {
//     console.log('MIDDLEWARE LOG');
//     // console.log('REQUEST=', req);
//     const { method } = req;
//     // const parsedUrl = parse(url || '', true);
//     const startTime = Date.now();
//     const fullUrl = new URL(req.url || '', `http://${req.headers.host}`);
//     const originalUrl = fullUrl.href;
//     const queryParams = parse(req.url || '', true).query;
//     // const query = parsedUrl.query;

//     const body = await getBody(req);

//     this.loggingService.log(
//       `Request: [${method}] ${originalUrl} - Query: ${JSON.stringify(
//         queryParams,
//       )} Body: ${JSON.stringify(body)}`,
//     );

//     res.on('finish', () => {
//       const statusCode = res.statusCode;
//       const responseTime = Date.now() - startTime;
//       this.loggingService.log(
//         `Response Status: ${statusCode} - Time: ${responseTime}ms`,
//       );
//     });

//     next();
//   }
// }

// function getBody(req: IncomingMessage): Promise<string> {
//   return new Promise((resolve, reject) => {
//     console.log('getbody');
//     let body = '';

//     req.on('data', (chunk) => {
//       body += chunk;
//     });

//     req.on('end', () => {
//       resolve(body);
//     });

//     req.on('error', (err) => {
//       reject(err);
//     });
//   });
// }
