import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

const imports =
  process.env.NODE_ENV === 'production'
    ? [
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '.', 'app'),
        exclude: ['/api*'],
      }),
    ]
    : [];

@Module({
  imports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
