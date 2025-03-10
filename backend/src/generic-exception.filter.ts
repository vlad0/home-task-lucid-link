import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GenericExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GenericExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest();

    let status = 500;
    let message: string | object = 'Ooops something went wrong';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    let payload = {};
    if (typeof message === 'string') {
      payload['message'] = message;
    } else {
      payload = message;
    }

    this.logger.error('Ooops something went wrong:', {
      exception,
      path: request.url,
      requestId: request.headers['x-request-id'],
      payload,
    });

    response.status(status).json({
      statusCode: status,

      ...payload,
    });
  }
}
