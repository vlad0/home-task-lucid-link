import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { PricePoint } from '../utils';
import { HttpLogger } from '../common/http-logger.service';

@Injectable()
export class PriceDataRepository {
  private readonly folderPath = './data';

  constructor(private readonly logger: HttpLogger) { }

  public async fetch(key: string) {
    return this.loadFile(`${key}.json`);
  }

  private async loadFile(
    file: string,
    folderPath?: string,
  ): Promise<PricePoint[]> {
    const filePath = path.join(folderPath ?? this.folderPath, file);

    if (!fs.existsSync(filePath)) {
      const fileName = path.basename(file, path.extname(file));
      throw new Error(`No data exists for ${fileName}`);
    }

    if (fs.statSync(filePath).isFile()) {
      const start = performance.now();

      this.logger.log(`Processing file: ${filePath}`);

      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({ input: fileStream });

      let jsonString = '';

      for await (const line of rl) {
        jsonString += line.trim();
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const jsonData: PricePoint[] = JSON.parse(jsonString);
        this.logger.log('File parsing duration: ', {
          duration: Math.floor(performance.now() - start),
        });
        return jsonData;
      } catch (err) {
        this.logger.error(`Error parsing JSON in ${filePath}:`, { err });
      }
    }

    return [];
  }
}
