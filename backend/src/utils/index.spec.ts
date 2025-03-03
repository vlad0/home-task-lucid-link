import {
  findMostProfitableTrade,
  findMostProfitableTradeMultiDates,
  PricePoint,
  toTradeInfoArray,
} from './';
import {
  priceData,
  priceDataDoubleVUptrend,
  priceDataNoRecommendationDowntrend,
  priceDataNoRecommendationFlatLine,
  priceDataMform,
  priceDataReverseV,
  priceDataUptrend,
  priceDataVForm,
  priceDataSform,
  priceDataSformMostRecent,
  multiDates01,
  multiDates02,
  multiDates03Flat,
  multiDate04,
} from './mock';

const buildExpectedResponse = (
  data: PricePoint[],
  buyTime: string,
  sellTime: string,
) => {
  const buyPrice = data.find((p) => p.timestamp === buyTime)?.price;
  const sellPrice = data.find((p) => p.timestamp === sellTime)?.price;

  if (!buyPrice || !sellPrice) {
    throw new Error(
      `buyPrice or sellPrice are not defined for buyTime: ${buyTime} and sellTime: ${sellTime}`,
    );
  }

  const maxProfit = sellPrice - buyPrice;

  return {
    buyTime,
    buyPrice,
    sellTime,
    sellPrice,
    maxProfit,
  };
};

// TODO: test shortest
describe('Most profitable trade utils', () => {
  it('should calculate most profitable trade - basic scenario', () => {
    const data = priceData;
    const result = findMostProfitableTrade(data);

    const buyTime = '2024-03-01T01:00:00Z';
    const sellTime = '2024-03-01T04:00:00Z';

    expect(result).toEqual(
      expect.objectContaining(buildExpectedResponse(data, buyTime, sellTime)),
    );
  });

  it('should calculate most profitable trade for S form', () => {
    const data = priceDataSform;
    const result = findMostProfitableTrade(data);

    const buyTime = '2024-03-01T02:00:00Z';
    const sellTime = '2024-03-01T05:00:00Z';

    expect(result).toEqual(
      expect.objectContaining(buildExpectedResponse(data, buyTime, sellTime)),
    );
  });

  it('should calculate most profitable trade and MOST RECENT for S form', () => {
    const data = priceDataSformMostRecent;
    const result = findMostProfitableTrade(data);
    const buyTime = '2024-03-01T02:00:00Z';
    const sellTime = '2024-03-01T05:00:00Z';

    expect(result).toEqual(
      expect.objectContaining(buildExpectedResponse(data, buyTime, sellTime)),
    );
  });

  it('should calculate most profitable trade for Uptrend', () => {
    const data = priceDataUptrend;
    const result = findMostProfitableTrade(data);

    const buyTime = '2024-03-01T00:00:00Z';
    const sellTime = '2024-03-01T05:00:00Z';

    expect(result).toEqual(
      expect.objectContaining(buildExpectedResponse(data, buyTime, sellTime)),
    );
  });

  it('should calculate most profitable trade for V form', () => {
    const data = priceDataVForm;
    const result = findMostProfitableTrade(data);
    const buyTime = '2024-03-01T03:00:00Z';
    const sellTime = '2024-03-01T05:00:00Z';

    expect(result).toEqual(
      expect.objectContaining(buildExpectedResponse(data, buyTime, sellTime)),
    );
  });

  it('should calculate most profitable trade for reverse V form', () => {
    const data = priceDataReverseV;
    const result = findMostProfitableTrade(data);

    const buyTime = '2024-03-01T00:00:00Z';
    const sellTime = '2024-03-01T02:00:00Z';

    expect(result).toEqual(
      expect.objectContaining(buildExpectedResponse(data, buyTime, sellTime)),
    );
  });

  it('should calculate most profitable trade for double V form uptrend', () => {
    const data = priceDataDoubleVUptrend;
    const result = findMostProfitableTrade(data);

    const buyTime = '2024-03-01T03:00:00Z';
    const sellTime = '2024-03-01T10:00:00Z';

    expect(result).toEqual(
      expect.objectContaining(buildExpectedResponse(data, buyTime, sellTime)),
    );
  });

  it('should calculate most profitable trade for M form', () => {
    const data = priceDataMform;
    const result = findMostProfitableTrade(data);

    const buyTime = '2024-03-01T00:00:00Z';
    const sellTime = '2024-03-01T09:00:00Z';

    expect(result).toEqual(
      expect.objectContaining(buildExpectedResponse(data, buyTime, sellTime)),
    );
  });

  // TODO: test when the initial period has higher profit than the consolidated one
  it.skip('should calculate most profitable trade for double Multi dates', () => {
    const data = [multiDates01, multiDates02, multiDates03Flat, multiDate04];
    const result = toTradeInfoArray(data);
    console.log(
      'items',
      data.flatMap((d) => d),
    );

    const consolidated = findMostProfitableTradeMultiDates(result);

    console.log('cons', consolidated);
  });

  it.skip('should not provide recommendation because of downtrend', () => {
    const result = findMostProfitableTrade(priceDataNoRecommendationDowntrend);

    expect(result).toEqual(null);
  });

  it.skip('should not provide recommendation because of flat line', () => {
    const result = findMostProfitableTrade(priceDataNoRecommendationFlatLine);

    expect(result).toEqual(null);
  });
});
