import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { catchError, map, Observable, timeout, TimeoutError } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class GenericInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GenericInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const requestId = request.headers['x-request-id'];

    const start = performance.now();
    this.logger.log('Request parms', {
      path: request.url,
      method: request.method,
      query: request.query,
      payload: request.body as unknown,
      requestId,
    });

    return next.handle().pipe(
      timeout(5000),
      map((data: unknown) => {
        const duration = Math.floor(performance.now() - start);

        this.logger.log('Response Data:', {
          data,
          requestId,
          duration,
        });

        return data;
      }),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException('Request took tooo long');
        }
        throw err;
      }),
    );
  }
}
