import { Inject, LoggerService, Logger as NestLogger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_LOCAL_STORAGE, AsyncStorage } from './constants';

export class HttpLogger implements LoggerService {
  private logger: NestLogger;

  constructor(
    @Inject(ASYNC_LOCAL_STORAGE)
    private readonly asyncLocalStorage: AsyncLocalStorage<AsyncStorage>,
  ) { }

  setContext(context: string) {
    this.logger = new NestLogger(context);
  }

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
    type: 'log' | 'error' | 'warn' | 'debug' | 'verbose',
    message: string,
    params?: Record<string, unknown>,
  ) {
    const requestId = this.asyncLocalStorage.getStore()?.requestId;

    this.logger[type](message, {
      ...params,
      requestId,
    });
  }
}
export { LoggerService };
