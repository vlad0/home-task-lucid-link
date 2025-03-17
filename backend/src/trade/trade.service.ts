import {
  addSeconds,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfHour,
  format,
  isAfter,
  isBefore,
  startOfDay,
  startOfHour,
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

    if (dates.length === 1) {
      tradeInfos.push(await this.calculateHourlyCandles(start, end));
    } else {
      const first = await this.calculateHourlyCandles(start, endOfDay(start));
      tradeInfos.push(first);

      const last = await this.calculateHourlyCandles(startOfDay(end), end);

      const middleDates = dates.slice(1, -1);
      for (const date of middleDates) {
        const key = format(date, 'yyyy-MM-dd');

        const tradeInfo = await this.priceDataService.getDailyCandle(key);
        tradeInfos.push(tradeInfo);
      }

      tradeInfos.push(last);
    }

    return findMostProfitableTradeByCandles(tradeInfos);
  }

  private async calculateHourlyCandles(startDate: Date, endDate: Date) {
    const start = new UTCDate(startDate);
    const end = new UTCDate(endDate);

    if (end < start) {
      throw new BadRequestException(
        `End date: ${end.toISOString()} cannot be before ${start.toISOString()} date`,
      );
    }

    const hours = eachHourOfInterval({
      start,
      end,
    });

    const tradeInfos: TradeInfo[] = [];

    if (hours.length === 1) {
      tradeInfos.push(await this.calculatePricePoints(start, end));
    } else {
      const first = await this.calculatePricePoints(start, endOfHour(start));
      tradeInfos.push(first);

      const last = await this.calculatePricePoints(startOfHour(end), end);

      const middleHours = hours.slice(1, -1);
      for (const hour of middleHours) {
        const key = format(hour, 'yyyy-MM-dd');

        const tradeInfo = await this.priceDataService.getHourlyCandle(
          key,
          hour.getUTCHours(),
        );
        tradeInfos.push(tradeInfo);
      }

      tradeInfos.push(last);
    }

    return findMostProfitableTradeByCandles(tradeInfos);
  }

  private async calculatePricePoints(start: Date, end: Date) {
    const pricePoints = await this.loadPricePoints(start, end);
    return findMostProfitableTrade(pricePoints);
  }
  private async loadPricePoints(
    startDate: Date,
    endDate: Date,
  ): Promise<PricePoint[]> {
    const start = new UTCDate(startDate);
    const end = new UTCDate(endDate);

    const key = format(startDate, 'yyyy-MM-dd');
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
