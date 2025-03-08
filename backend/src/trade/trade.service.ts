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
import { UTCDate } from '@date-fns/utc';

@Injectable()
export class TradeService {
  constructor(private readonly priceDataService: PriceDataService) { }

  public async findBestTrade(startDate: Date, endDate: Date) {
    const start = new UTCDate(startDate);
    const end = new UTCDate(endDate);

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

    const result = findMostProfitableTradeByCandles(tradeInfos);

    if (result.maxProfit === 0) {
      return { status: 'NO_PROFITABLE_TRADE' };
    }

    return result;
  }

  private async loadPricePoints(
    date: Date,
    startDate: Date,
    endDate: Date,
  ): Promise<PricePoint[]> {
    const start = new UTCDate(startDate);
    const end = new UTCDate(endDate);

    const key = format(date, 'yyyy-MM-dd');
    const pricePoints = await this.priceDataService.fetch(key);

    return pricePoints.filter((p) => {
      const isAfterA = isAfter(addSeconds(new UTCDate(p.timestamp), 1), start);
      const isBeforeA = isBefore(new UTCDate(p.timestamp), addSeconds(end, 1));
      return isAfterA && isBeforeA;
    });
  }
}
