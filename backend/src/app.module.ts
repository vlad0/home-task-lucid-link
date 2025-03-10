import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { CacheModule } from '@nestjs/cache-manager';
import { TradeModule } from './trade/trade.module';
import { CommonModule } from './common/common.module';

const imports =
  process.env.NODE_ENV !== 'production'
    ? [
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '.', 'app'),
        exclude: ['/api*'],
      }),
    ]
    : [];

@Module({
  imports: [
    ...imports,
    CommonModule,
    CacheModule.register({
      isGlobal: true,
    }),
    TradeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
