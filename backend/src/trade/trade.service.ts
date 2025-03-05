import {
  addSeconds,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
} from 'date-fns';
import {
  findMostProfitableTrade,
  findMostProfitableTradeByCandles,
  PricePoint,
  TradeInfo,
} from '../utils';
import { Injectable } from '@nestjs/common';
import { PriceDataService } from './price-data.service';

@Injectable()
export class TradeService {
  constructor(private readonly priceDataService: PriceDataService) { }

  public async loadPricePoints(
    date: Date,
    start: Date,
    end: Date,
  ): Promise<PricePoint[]> {
    const key = format(date, 'yyyy-MM-dd');
    const pricePoints = await this.priceDataService.fetch(key);

    return pricePoints.filter((p) => {
      const isAfterA = isAfter(addSeconds(new Date(p.timestamp), 1), start);
      const isBeforeA = isBefore(new Date(p.timestamp), addSeconds(end, 1));
      return isAfterA && isBeforeA;
    });
  }

  public async findBestTrade(start: Date, end: Date) {
    const dates = eachDayOfInterval({
      start,
      end,
    });

    const tradeInfos: TradeInfo[] = [];
    for (const date of dates) {
      if (isSameDay(date, start) || isSameDay(date, end)) {
        const pricePoints = await this.loadPricePoints(date, start, end);
        const tradeInfo = findMostProfitableTrade(pricePoints);
        tradeInfos.push(tradeInfo);
        continue;
      }

      const key = format(date, 'yyyy-MM-dd');

      const tradeInfo = await this.priceDataService.getDailyCandle(key);
      tradeInfos.push(tradeInfo);
    }

    return findMostProfitableTradeByCandles(tradeInfos);
  }
}
