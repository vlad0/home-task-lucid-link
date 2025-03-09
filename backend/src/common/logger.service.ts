import {
  Injectable,
  LoggerService,
  Scope,
  Logger as NestLogger,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class GenericLogger implements LoggerService {
  private readonly logger = new NestLogger();

  constructor(@Inject(REQUEST) private request: Request) { }

  log(message: string, params?: Record<string, unknown>) {
    this.produce('log', message, params);
  }

  error(message: string, params?: Record<string, unknown>) {
    this.produce('error', message, params);
  }

  warn(message: string, params?: Record<string, unknown>) {
    this.produce('warn', message, params);
  }

  debug(message: string, params?: Record<string, unknown>) {
    this.produce('debug', message, params);
  }

  verbose(message: string, params?: Record<string, unknown>) {
    this.produce('verbose', message, params);
  }

  private produce(
    // TODO: fix types
    type: 'log' | 'error' | 'warn' | 'debug' | 'verbose',
    message: string,
    params?: Record<string, unknown>,
  ) {
    this.logger[type](message, {
      ...params,
      requestId: this.request.headers['x-request-id'] as string,
    });
  }
}
export { LoggerService };
