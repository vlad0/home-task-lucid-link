import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { findMostProfitableTrade, PricePoint, TradeInfo } from '../utils';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class PriceDataService implements OnApplicationBootstrap {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  private readonly folderPath = './data';

  async onApplicationBootstrap() {
    console.log('Processing files on startup');

    const usage = process.memoryUsage();
    const result = {
      rss: (usage.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (usage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (usage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      external: (usage.external / 1024 / 1024).toFixed(2) + ' MB',
      arrayBuffers: (usage.arrayBuffers / 1024 / 1024).toFixed(2) + ' MB',
    };

    console.log('Memory Usage: ', result);
    await this.init(this.folderPath);

    const usage2 = process.memoryUsage();
    const result2 = {
      rss: (usage2.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (usage2.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (usage2.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      external: (usage2.external / 1024 / 1024).toFixed(2) + ' MB',
      arrayBuffers: (usage2.arrayBuffers / 1024 / 1024).toFixed(2) + ' MB',
    };

    console.log('Memory Usage: ', result2);
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
    return this.loadFile(`${key}.json`);
  }

  public async getDailyCandle(date: string): Promise<TradeInfo> {
    const cache = await this.cacheManager.get<TradeInfo>(date);

    if (cache) {
      console.log(`Serving from cache for ${date}`);
      return cache;
    }

    const jsonData = await this.fetch(date);
    const dailyCandle = findMostProfitableTrade(jsonData);

    console.log(`Updating cache for ${date}`);
    await this.cacheManager.set(date, dailyCandle);

    return dailyCandle;
  }

  private async loadFile(
    file: string,
    folderPath?: string,
  ): Promise<PricePoint[]> {
    const filePath = path.join(folderPath ?? this.folderPath, file);

    if (fs.statSync(filePath).isFile()) {
      const start = Date.now();

      console.log(`Processing file: ${filePath}`);

      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({ input: fileStream });

      let jsonString = '';

      for await (const line of rl) {
        jsonString += line.trim();
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const jsonData: PricePoint[] = JSON.parse(jsonString);
        console.log('File parsing duration: ', Date.now() - start);
        return jsonData;
      } catch (err) {
        console.error(`Error parsing JSON in ${filePath}:`, err);
      }
    }

    return [];
  }
}
