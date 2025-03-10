import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { v4 } from 'uuid';
import { Request } from 'express';
import { ASYNC_LOCAL_STORAGE, AsyncStorage } from 'src/common/constants';

@Injectable()
export class RequestStorageMiddleware implements NestMiddleware {
  constructor(
    @Inject(ASYNC_LOCAL_STORAGE)
    private readonly asyncLocalStorage: AsyncLocalStorage<AsyncStorage>,
  ) { }

  use(req: Request, res: any, next: (error?: any) => void) {
    const requestId = v4();
    req.headers['x-request-id'] = requestId;

    this.asyncLocalStorage.run({ requestId }, () => next());
  }
}
