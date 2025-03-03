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

export const toTradeInfoArray = (pricePoints: PricePoint[][]) => {
  return pricePoints.map(findMostProfitableTrade);
};

export const findMostProfitableTradeMultiDates = (info: TradeInfo[]) => {
  const arr: PricePoint[] = [];

  for (const element of info) {
    // max is before min
    // so we ignore profitable trades within a day
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
  if (prices.length < 2) {
    throw Error(`Not enough data! Prices length ${prices.length}`);
  }

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
