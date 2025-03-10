import {
  addSeconds,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
} from 'date-fns';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PriceDataService } from './price-data.service';
import { UTCDate } from '@date-fns/utc';
import { NO_PROFITABLE_TRADE } from './constants';
import { HttpLogger } from '../common/http-logger.service';
import BigNumber from 'bignumber.js';
import {
  findMostProfitableTrade,
  findMostProfitableTradeByCandles,
  PricePoint,
  TradeInfo,
} from '../utils';

@Injectable()
export class TradeService {
  constructor(
    private readonly priceDataService: PriceDataService,
    private readonly logger: HttpLogger,
  ) { }

  public async findBestTrade(startDate: Date, endDate: Date) {
    const result = await this.calculateBestTrade(startDate, endDate);

    const maxProfit = new BigNumber(result.maxProfit);

    if (maxProfit.isEqualTo(0)) {
      return { status: NO_PROFITABLE_TRADE };
    }

    const buyPrice = new BigNumber(result.buyPrice);
    const sellPrice = new BigNumber(result.sellPrice);

    if (result.buyTime > result.sellTime || buyPrice.isGreaterThan(sellPrice)) {
      this.logger.error('Result contains bad response', result);

      throw new InternalServerErrorException(
        'Server could NOT process this error successfully',
      );
    }

    return result;
  }

  private async calculateBestTrade(startDate: Date, endDate: Date) {
    const start = new UTCDate(startDate);
    const end = new UTCDate(endDate);

    if (end < start) {
      throw new BadRequestException(
        `End date: ${end.toISOString()} cannot be before ${start.toISOString()} date`,
      );
    }

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

  private async loadPricePoints(
    date: Date,
    startDate: Date,
    endDate: Date,
  ): Promise<PricePoint[]> {
    const start = new UTCDate(startDate);
    const end = new UTCDate(endDate);

    const key = format(date, 'yyyy-MM-dd');
    const pricePoints = await this.priceDataService.fetch(key);

    const result: PricePoint[] = [];
    for (const p of pricePoints) {
      const isAfterA = isAfter(addSeconds(new UTCDate(p.timestamp), 1), start);
      const isBeforeA = isBefore(new UTCDate(p.timestamp), addSeconds(end, 1));

      if (!isBeforeA) {
        break;
      }

      if (isAfterA && isBeforeA) {
        result.push(p);
      }
    }

    return result;
  }
}
