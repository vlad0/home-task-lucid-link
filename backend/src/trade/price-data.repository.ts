import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { PricePoint } from '../utils';
import { GenericLogger } from 'src/common/logger.service';

@Injectable()
export class PriceDataRepository {
  private readonly folderPath = './data';

  constructor(private readonly logger: GenericLogger) { }

  public async fetch(key: string) {
    return this.loadFile(`${key}.json`);
  }

  private async loadFile(
    file: string,
    folderPath?: string,
  ): Promise<PricePoint[]> {
    const filePath = path.join(folderPath ?? this.folderPath, file);

    if (fs.statSync(filePath).isFile()) {
      const start = Date.now();

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
          fileParsing: Date.now() - start,
        });
        return jsonData;
      } catch (err) {
        this.logger.error(`Error parsing JSON in ${filePath}:`, { err });
      }
    }

    return [];
  }
}
