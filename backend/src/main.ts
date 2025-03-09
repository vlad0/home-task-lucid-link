import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GenericExceptionFilter } from './generic-exception.filter';
import { GenericInterceptor } from './generic.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GenericExceptionFilter());
  app.useGlobalInterceptors(new GenericInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
