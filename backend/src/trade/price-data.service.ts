import {
  BadRequestException,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { findMostProfitableTrade, TradeInfo } from '../utils';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PriceDataRepository } from './price-data.repository';
import { HttpLogger } from '../common/http-logger.service';

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

  public async getDailyCandle(date: string): Promise<TradeInfo> {
    const cache = await this.cacheManager.get<TradeInfo>(date);

    if (cache) {
      this.logger.log(`Serving from cache for ${date}`);
      return cache;
    }

    const jsonData = await this.priceDataRepository.fetch(date);
    const dailyCandle = findMostProfitableTrade(jsonData);

    this.logger.log(`Updating cache for ${date}`);
    await this.cacheManager.set(date, dailyCandle);

    return dailyCandle;
  }
}
