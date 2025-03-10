import { differenceInMilliseconds } from 'date-fns';

import { UTCDate } from '@date-fns/utc';
import BigNumber from 'bignumber.js';

export type PricePoint = {
  timestamp: string;
  price: number | BigNumber;
};

export type TradeInfo = {
  buyTime: string;
  buyPrice: string;
  sellTime: string;
  sellPrice: string;
  maxProfit: string;
  maxPrice: string;
  maxTime: string;
  minPrice: string;
  minTime: string;
};

export const findMostProfitableTradeByCandles = (info: TradeInfo[]) => {
  const arr: PricePoint[] = [];

  for (const element of info) {
    // max is before min
    // so the logic don't accidentally consider profitable trades from min/max
    arr.push({
      timestamp: element.maxTime,
      price: new BigNumber(element.maxPrice),
    });

    arr.push({
      timestamp: element.minTime,
      price: new BigNumber(element.minPrice),
    });
  }

  const consolidated = findMostProfitableTrade(arr);

  let result: TradeInfo = consolidated;

  for (const element of info) {
    const potentialHoldingDuration = differenceInMilliseconds(
      new UTCDate(element.sellTime),
      new UTCDate(element.buyTime),
    );
    const holdingDuration = differenceInMilliseconds(
      new UTCDate(result.sellTime),
      new UTCDate(result.buyTime),
    );
    const potentialProfit = new BigNumber(element.maxProfit);
    const maxProfit = new BigNumber(result.maxProfit ?? 0);

    if (
      shouldUpdateTrade(
        potentialProfit,
        maxProfit,
        potentialHoldingDuration,
        holdingDuration,
      )
    ) {
      result = element;
    }
  }

  return result;
};

const shouldUpdateTrade = (
  potentialProfit: BigNumber,
  maxProfit: BigNumber,
  potentialHoldingDuration: number,
  holdingDuration: number,
) =>
  potentialProfit.isGreaterThan(maxProfit) ||
  (potentialProfit.isEqualTo(maxProfit) &&
    potentialHoldingDuration < holdingDuration);

export const findMostProfitableTrade = (prices: PricePoint[]): TradeInfo => {
  // TODO: handle trade info
  let minPrice = new BigNumber(prices[0].price);
  let maxPrice = new BigNumber(prices[0].price);
  let maxTime = prices[0].timestamp;
  let minTime = prices[0].timestamp;
  let maxProfit = new BigNumber(0);
  let buyTime: string = '';
  let buyPrice = new BigNumber(0);
  let sellTime: string = '';
  let sellPrice = new BigNumber(0);
  let holdingDuration: number = 0;

  for (let i = 1; i < prices.length; i++) {
    const { timestamp, price } = prices[i];

    const safePrice = new BigNumber(price);

    const potentialProfit = safePrice.minus(minPrice);
    const potentialHoldingDuration: number = differenceInMilliseconds(
      new UTCDate(timestamp),
      new UTCDate(minTime),
    );

    if (
      shouldUpdateTrade(
        potentialProfit,
        maxProfit,
        potentialHoldingDuration,
        holdingDuration,
      )
    ) {
      maxProfit = potentialProfit;
      buyTime = minTime;
      sellTime = timestamp;
      sellPrice = safePrice;
      buyPrice = minPrice;
      holdingDuration = potentialHoldingDuration;
    }

    if (safePrice.isLessThanOrEqualTo(minPrice)) {
      minPrice = safePrice;
      minTime = timestamp;
    }

    if (safePrice.isGreaterThanOrEqualTo(maxPrice)) {
      maxPrice = safePrice;
      maxTime = timestamp;
    }
  }

  return {
    buyTime,
    buyPrice: buyPrice.toString(),
    sellTime,
    sellPrice: sellPrice.toString(),
    maxProfit: maxProfit.toString(),
    maxPrice: maxPrice.toString(),
    maxTime,
    minPrice: minPrice.toString(),
    minTime,
  };
};
