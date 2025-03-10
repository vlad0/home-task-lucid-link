import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PraseUtcDatePipe } from './prase-utc-date.pipe';
import { HttpLogger } from './http-logger.service';
import { RequestStorageMiddleware } from './request-storage.middleware';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_LOCAL_STORAGE } from './constants';

@Module({
  providers: [
    PraseUtcDatePipe,
    {
      provide: ASYNC_LOCAL_STORAGE,
      useValue: new AsyncLocalStorage(),
    },
    HttpLogger,
    RequestStorageMiddleware,
  ],
  exports: [HttpLogger],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*path');
  }
}
