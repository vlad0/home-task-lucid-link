import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { map, Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class GenericInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GenericInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const requestId = v4();
    request.headers['x-request-id'] = requestId;

    this.logger.log('Request parms', {
      path: request.url,
      method: request.method,
      query: request.query,
      payload: request.body as unknown,
      requestId,
    });

    return next.handle().pipe(
      map((data: unknown) => {
        // Log the response data (customize what you want to log)
        this.logger.log('Response Data:', { data, requestId });

        return data;
      }),
    );
  }
}
