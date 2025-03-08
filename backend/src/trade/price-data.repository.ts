import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { PricePoint } from '../utils';

@Injectable()
export class PriceDataRepository {
  private readonly folderPath = './data';

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
