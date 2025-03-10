import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() { }

  @Get('healthcheck')
  healtcheck() {
    return { status: HttpStatus.OK };
  }

  @Get('liveness')
  liveness() {
    return { status: HttpStatus.OK };
  }

  @Get('memory')
  getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: (usage.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (usage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (usage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      external: (usage.external / 1024 / 1024).toFixed(2) + ' MB',
      arrayBuffers: (usage.arrayBuffers / 1024 / 1024).toFixed(2) + ' MB',
    };
  }
}
