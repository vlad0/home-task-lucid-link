import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GenericExceptionFilter } from './generic-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GenericExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
