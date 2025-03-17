import {
  BadRequestException,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  findMostProfitableTrade,
  findMostProfitableTradeByCandles,
  PricePoint,
  TradeInfo,
} from '../utils';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PriceDataRepository } from './price-data.repository';
import { HttpLogger } from '../common/http-logger.service';
import { UTCDate } from '@date-fns/utc';

@Injectable()
export class PriceDataService implements OnApplicationBootstrap {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly priceDataRepository: PriceDataRepository,
    private readonly logger: HttpLogger,
  ) {
    this.logger.setContext(PriceDataService.name);
  }

  private readonly folderPath = './data';

  async onApplicationBootstrap() {
    this.logger.log('Processing files on startup');

    const usage = process.memoryUsage();
    const result = {
      rss: (usage.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (usage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (usage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      external: (usage.external / 1024 / 1024).toFixed(2) + ' MB',
      arrayBuffers: (usage.arrayBuffers / 1024 / 1024).toFixed(2) + ' MB',
    };

    this.logger.log('Memory Usage: ', result);
    await this.init(this.folderPath);

    const usage2 = process.memoryUsage();
    const result2 = {
      rss: (usage2.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (usage2.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (usage2.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      external: (usage2.external / 1024 / 1024).toFixed(2) + ' MB',
      arrayBuffers: (usage2.arrayBuffers / 1024 / 1024).toFixed(2) + ' MB',
    };

    this.logger.log('Memory Usage: ', result2);
  }

  private async init(folderPath: string) {
    try {
      const files = fs.readdirSync(folderPath);
      const startAll = Date.now();

      for (const file of files) {
        try {
          const fileName = path.basename(file, path.extname(file));
          await this.cacheHourlyCandles(fileName);

          await this.getDailyCandle(fileName);
        } catch (err) {
          console.error(`Error parsing JSON in ${file}:`, err);
        }
      }

      console.log('All Files parsed duration: ', Date.now() - startAll);
    } catch (err) {
      console.error('Error processing files:', err);
    }
  }

  public async fetch(key: string) {
    try {
      return await this.priceDataRepository.fetch(key);
    } catch (err) {
      this.logger.error(`Fetching data for ${key} failed`, { key, err });
      throw new BadRequestException(`No data exists for ${key}`);
    }
  }

  public async cacheHourlyCandles(date: string) {
    const jsonData = await this.priceDataRepository.fetch(date);

    let batch: PricePoint[] = [];
    let lastHour = 0;
    for (const element of jsonData) {
      const hour = new UTCDate(element.timestamp).getUTCHours();
      if (hour === lastHour) {
        batch.push(element);
      } else {
        const candle = findMostProfitableTrade(batch);

        const key = `${date}H${lastHour}`;
        this.logger.log(`Updating cache for ${key}`);
        await this.cacheManager.set(key, candle);

        lastHour = hour;
        batch = [element];
      }
    }

    // handle last batch
    const candle = findMostProfitableTrade(batch);

    const key = `${date}H${lastHour}`;
    this.logger.log(`Updating cache for ${key}`);
    await this.cacheManager.set(key, candle);
  }

  public async getHourlyCandle(date: string, hour: number) {
    const key = `${date}H${hour}`;
    const cache = await this.cacheManager.get<TradeInfo>(key);

    if (cache) {
      this.logger.log(`Serving from cache for ${key}`);
      return cache;
    }

    await this.cacheHourlyCandles(date);

    const result = await this.cacheManager.get<TradeInfo>(key);

    if (!result) {
      throw new Error(`No hourly candle for ${key}`);
    }

    return result;
  }

  public async getDailyCandle(date: string): Promise<TradeInfo> {
    const cache = await this.cacheManager.get<TradeInfo>(date);

    if (cache) {
      this.logger.log(`Serving from cache for ${date}`);
      return cache;
    }

    const candles: TradeInfo[] = [];
    for (let index = 0; index < 24; index++) {
      const hourlyCandle = await this.cacheManager.get<TradeInfo>(
        `${date}H${index}`,
      );
      if (hourlyCandle === null) {
        this.logger.log(`no info for key ${date}H${index}`);
        continue;
      }

      candles.push(hourlyCandle as unknown as TradeInfo);
    }

    const dailyCandle = findMostProfitableTradeByCandles(candles);

    this.logger.log(`Updating cache for ${date}`);
    await this.cacheManager.set(date, dailyCandle);

    return dailyCandle;
  }
}
