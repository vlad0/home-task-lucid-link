import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global-exception.filter';
import { GlobalInterceptor } from './global.interceptor';
import { HttpLogger } from './common/http-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new GlobalInterceptor(app.get(HttpLogger)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
