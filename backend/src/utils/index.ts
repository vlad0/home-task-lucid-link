import {
  addSeconds,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
} from 'date-fns';
import { inMemoryPricePointsMock, inMemoryTradeInfoMock } from './mock';

export type PricePoint = {
  timestamp: string;
  price: number;
};
export type TradeInfo = {
  buyTime: string;
  buyPrice: number;
  sellTime: string;
  sellPrice: number;
  maxProfit: number;
  maxPrice: number;
  maxTime: string;
  minPrice: number;
  minTime: string;
};

export const loadTradeInfo = (start: Date, end: Date) => {
  const dates = eachDayOfInterval({
    start,
    end,
  });

  const tradeInfos: TradeInfo[] = [];
  for (const date of dates) {
    if (isSameDay(date, start) || isSameDay(date, end)) {
      const pricePoints = loadPricePoints(date, start, end);
      const tradeInfo = findMostProfitableTrade(pricePoints);
      tradeInfos.push(tradeInfo);
      continue;
    }

    const tradeInfo = loadSingleDateTradeInfo(date);
    tradeInfos.push(tradeInfo);
  }

  return findMostProfitableTradeMultiDates(tradeInfos);
};

const loadSingleDateTradeInfo = (date: Date): TradeInfo => {
  const key = format(date, 'yyyy-MM-dd');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return inMemoryTradeInfoMock[key]();
};

const loadPricePoints = (date: Date, start: Date, end: Date): PricePoint[] => {
  const key = format(date, 'yyyy-MM-dd');
  const pricePoints = inMemoryPricePointsMock[key];

  return pricePoints.filter(
    (p) =>
      isAfter(addSeconds(new Date(p.timestamp), 1), start) &&
      isBefore(new Date(p.timestamp), addSeconds(end, 1)),
  );
};

export const toTradeInfoArray = (pricePoints: PricePoint[][]) => {
  return pricePoints.map(findMostProfitableTrade);
};

export const findMostProfitableTradeMultiDates = (info: TradeInfo[]) => {
  const arr: PricePoint[] = [];

  for (const element of info) {
    // max is before min
    // so the logic don't accidentally consider profitable trades from min/max
    arr.push({
      timestamp: element.maxTime,
      price: element.maxPrice,
    });

    arr.push({
      timestamp: element.minTime,
      price: element.minPrice,
    });
  }

  const consolidated = findMostProfitableTrade(arr);

  let result: TradeInfo = consolidated;

  for (const element of info) {
    if (element.maxProfit > (result?.maxProfit ?? 0)) {
      result = element;
    }
  }

  return result;
};

// TODO: fix earliest and shortest requirement
export const findMostProfitableTrade = (prices: PricePoint[]): TradeInfo => {
  // TODO: does it make sense to buy and sell within a second
  // I think yes!
  // if (prices.length < 2) {
  //   throw Error(`Not enough data! Prices length ${prices.length}`);
  // }

  let minPrice = prices[0].price;
  let maxPrice = prices[0].price;
  let maxTime = prices[0].timestamp;
  let minTime = prices[0].timestamp;
  let maxProfit = 0;
  let buyTime: string = '';
  let buyPrice: number = 0;
  let sellTime: string = '';
  let sellPrice: number = 0;

  for (let i = 1; i < prices.length; i++) {
    const { timestamp, price } = prices[i];

    const potentialProfit = price - minPrice;
    if (potentialProfit >= maxProfit) {
      maxProfit = potentialProfit;
      buyTime = minTime;
      sellTime = timestamp;
      sellPrice = price;
      buyPrice = minPrice;
    }

    if (price <= minPrice) {
      minPrice = price;
      minTime = timestamp;
    }

    if (price >= maxPrice) {
      maxPrice = price;
      maxTime = timestamp;
    }
  }

  return {
    buyTime,
    buyPrice,
    sellTime,
    sellPrice,
    maxProfit,
    maxPrice,
    maxTime,
    minPrice,
    minTime,
  };
};
