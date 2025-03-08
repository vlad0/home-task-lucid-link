import { findMostProfitableTrade, PricePoint } from '../../utils';

export const priceData = [
  { timestamp: '2025-03-01T00:00:00Z', price: 15_000 },
  { timestamp: '2025-03-01T01:00:00Z', price: 14_000 }, // buy
  { timestamp: '2025-03-01T02:00:00Z', price: 15_500 },
  { timestamp: '2025-03-01T03:00:00Z', price: 16_000 },
  { timestamp: '2025-03-01T04:00:00Z', price: 18_000 }, // sell
  { timestamp: '2025-03-01T05:00:00Z', price: 12_000 },
];

export const priceDataSform = [
  { timestamp: '2025-03-01T00:00:00Z', price: 10_000 },
  { timestamp: '2025-03-01T01:00:00Z', price: 12_000 },
  { timestamp: '2025-03-01T02:00:00Z', price: 9_000 }, // buy
  { timestamp: '2025-03-01T03:00:00Z', price: 11_000 },
  { timestamp: '2025-03-01T04:00:00Z', price: 10_000 },
  { timestamp: '2025-03-01T05:00:00Z', price: 12_000 }, // sell
];

export const priceDataSformMostRecent = [
  { timestamp: '2025-03-01T00:00:00Z', price: 10_000 }, // buy
  { timestamp: '2025-03-01T01:00:00Z', price: 13_000 }, // sell
  { timestamp: '2025-03-01T02:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T03:00:00Z', price: 11_000 },
  { timestamp: '2025-03-01T04:00:00Z', price: 10_000 },
  { timestamp: '2025-03-01T05:00:00Z', price: 12_000 },
];

export const priceDataUptrend = [
  { timestamp: '2025-03-01T00:00:00Z', price: 5_000 }, // buy
  { timestamp: '2025-03-01T01:00:00Z', price: 6_000 },
  { timestamp: '2025-03-01T02:00:00Z', price: 7_000 },
  { timestamp: '2025-03-01T03:00:00Z', price: 8_000 },
  { timestamp: '2025-03-01T04:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T05:00:00Z', price: 10_000 }, // sell
];

export const priceDataVForm = [
  { timestamp: '2025-03-01T00:00:00Z', price: 10_000 },
  { timestamp: '2025-03-01T01:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T02:00:00Z', price: 8_000 },
  { timestamp: '2025-03-01T03:00:00Z', price: 8_000 }, // buy
  { timestamp: '2025-03-01T04:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T05:00:00Z', price: 10_000 }, // sell
];

export const priceDataDoubleVUptrend = [
  { timestamp: '2025-03-01T00:00:00Z', price: 17_000 },
  { timestamp: '2025-03-01T01:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T02:00:00Z', price: 8_000 }, // buy
  { timestamp: '2025-03-01T03:00:00Z', price: 8_000 },
  { timestamp: '2025-03-01T04:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T05:00:00Z', price: 10_000 },
  { timestamp: '2025-03-01T06:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T07:00:00Z', price: 10_000 },
  { timestamp: '2025-03-01T08:00:00Z', price: 10_000 },
  { timestamp: '2025-03-01T09:00:00Z', price: 11_000 },
  { timestamp: '2025-03-01T10:00:00Z', price: 12_000 }, // sell
];

export const priceDataReverseV = [
  { timestamp: '2025-03-01T00:00:00Z', price: 8_000 },
  { timestamp: '2025-03-01T01:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T02:00:00Z', price: 10_000 },
  { timestamp: '2025-03-01T03:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T04:00:00Z', price: 8_000 },
  { timestamp: '2025-03-01T05:00:00Z', price: 7_000 },
  { timestamp: '2025-03-01T06:00:00Z', price: 6_000 },
];

export const priceDataMform = [
  { timestamp: '2025-03-01T00:00:00Z', price: 5_000 },
  { timestamp: '2025-03-01T01:00:00Z', price: 6_000 },
  { timestamp: '2025-03-01T02:00:00Z', price: 7_000 },
  { timestamp: '2025-03-01T03:00:00Z', price: 8_000 },
  { timestamp: '2025-03-01T04:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T05:00:00Z', price: 8_000 },
  { timestamp: '2025-03-01T06:00:00Z', price: 7_000 },
  { timestamp: '2025-03-01T07:00:00Z', price: 6_000 },
  { timestamp: '2025-03-01T08:00:00Z', price: 8_000 },
  { timestamp: '2025-03-01T09:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T10:00:00Z', price: 4_000 },
];

export const priceDataNoRecommendationDowntrend = [
  { timestamp: '2025-03-01T00:00:00Z', price: 10_000 },
  { timestamp: '2025-03-01T01:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T02:00:00Z', price: 8_000 },
  { timestamp: '2025-03-01T03:00:00Z', price: 7_000 },
  { timestamp: '2025-03-01T04:00:00Z', price: 6_000 },
  { timestamp: '2025-03-01T05:00:00Z', price: 5_000 },
];

export const priceDataNoRecommendationFlatLine = [
  { timestamp: '2025-03-01T00:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T01:00:00Z', price: 9_000 },
  { timestamp: '2025-03-01T02:00:00Z', price: 9_000 },
];

export const multiDates01 = [
  { timestamp: '2025-03-01T00:00:00Z', price: 15_000 },
  { timestamp: '2025-03-01T01:00:00Z', price: 14_000 },
  { timestamp: '2025-03-01T02:00:00Z', price: 15_500 },
  { timestamp: '2025-03-01T03:00:00Z', price: 16_000 },
  { timestamp: '2025-03-01T04:00:00Z', price: 18_000 },
  { timestamp: '2025-03-01T05:00:00Z', price: 12_000 },
];

export const multiDates02 = [
  { timestamp: '2025-03-02T00:00:00Z', price: 17_000 },
  { timestamp: '2025-03-02T01:00:00Z', price: 9_000 },
  { timestamp: '2025-03-02T02:00:00Z', price: 9_000 },
  { timestamp: '2025-03-02T03:00:00Z', price: 9_000 },
  { timestamp: '2025-03-02T04:00:00Z', price: 9_000 },
  { timestamp: '2025-03-02T05:00:00Z', price: 10_000 },
  { timestamp: '2025-03-02T06:00:00Z', price: 9_000 },
  { timestamp: '2025-03-02T07:00:00Z', price: 10_000 },
  { timestamp: '2025-03-02T08:00:00Z', price: 10_000 },
  { timestamp: '2025-03-02T09:00:00Z', price: 11_000 },
  { timestamp: '2025-03-02T10:00:00Z', price: 12_000 },
];

export const multiDates03Flat = [
  { timestamp: '2025-03-03T00:00:00Z', price: 9_000 },
  { timestamp: '2025-03-03T01:00:00Z', price: 9_000 },
  { timestamp: '2025-03-03T02:00:00Z', price: 9_000 },
];

export const multiDate04 = [
  { timestamp: '2025-03-04T00:00:00Z', price: 10_000 },
  { timestamp: '2025-03-04T01:00:00Z', price: 13_000 },
  { timestamp: '2025-03-04T02:00:00Z', price: 9_000 },
  { timestamp: '2025-03-04T03:00:00Z', price: 11_000 },
  { timestamp: '2025-03-04T04:00:00Z', price: 10_000 },
  { timestamp: '2025-03-04T05:00:00Z', price: 12_000 },
];

// export const inMemoryPricePointsMock: Record<string, PricePoint[]> = {
//   '2025-03-01': [
//     { timestamp: '2025-03-01T00:00:00Z', price: 15_000 },
//     { timestamp: '2025-03-01T01:00:00Z', price: 14_000 },
//     { timestamp: '2025-03-01T02:00:00Z', price: 15_500 },
//     { timestamp: '2025-03-01T03:00:00Z', price: 7_000 },
//     { timestamp: '2025-03-01T04:00:00Z', price: 18_000 },
//     { timestamp: '2025-03-01T05:00:00Z', price: 12_000 },
//   ],
//   '2025-03-02': [
//     { timestamp: '2025-03-02T00:00:00Z', price: 20_000 },
//     { timestamp: '2025-03-02T01:00:00Z', price: 9_000 },
//     { timestamp: '2025-03-02T02:00:00Z', price: 9_000 },
//     { timestamp: '2025-03-02T03:00:00Z', price: 9_000 },
//     { timestamp: '2025-03-02T04:00:00Z', price: 19_000 },
//     { timestamp: '2025-03-02T05:00:00Z', price: 12_000 },
//     { timestamp: '2025-03-02T06:00:00Z', price: 9_000 },
//     { timestamp: '2025-03-02T07:00:00Z', price: 10_000 },
//     { timestamp: '2025-03-02T08:00:00Z', price: 10_000 },
//     { timestamp: '2025-03-02T09:00:00Z', price: 11_000 },
//     { timestamp: '2025-03-02T10:00:00Z', price: 12_000 },
//   ],
//   '2025-03-03': [
//     { timestamp: '2025-03-03T00:00:00Z', price: 9_000 },
//     { timestamp: '2025-03-03T01:00:00Z', price: 9_000 },
//     { timestamp: '2025-03-03T02:00:00Z', price: 9_000 },
//   ],
//   '2025-03-04': [
//     { timestamp: '2025-03-04T00:00:00Z', price: 10_000 },
//     { timestamp: '2025-03-04T01:00:00Z', price: 13_000 },
//     { timestamp: '2025-03-04T02:00:00Z', price: 9_000 },
//     { timestamp: '2025-03-04T03:00:00Z', price: 11_000 },
//     { timestamp: '2025-03-04T04:00:00Z', price: 19_500 },
//     { timestamp: '2025-03-04T05:00:00Z', price: 12_000 },
//   ],
// };

export const inMemoryPricePointsMock: Record<string, PricePoint[]> = {
  '2025-03-01': [
    { timestamp: '2025-03-01T00:00:00Z', price: 9_000 },
    { timestamp: '2025-03-01T01:00:00Z', price: 9_000 },
    { timestamp: '2025-03-01T02:00:00Z', price: 9_000 },
    { timestamp: '2025-03-01T03:00:00Z', price: 9_000 },
    { timestamp: '2025-03-01T04:00:00Z', price: 9_000 },
    { timestamp: '2025-03-01T05:00:00Z', price: 9_000 },
  ],
  '2025-03-02': [
    { timestamp: '2025-03-02T00:00:00Z', price: 9_000 },
    { timestamp: '2025-03-02T01:00:00Z', price: 8_000 },
    { timestamp: '2025-03-02T02:00:00Z', price: 7_000 },
    { timestamp: '2025-03-02T03:00:00Z', price: 6_000 },
    { timestamp: '2025-03-02T04:00:00Z', price: 5_000 },
    { timestamp: '2025-03-02T05:00:00Z', price: 6_000 },
    { timestamp: '2025-03-02T06:00:00Z', price: 7_000 },
    { timestamp: '2025-03-02T07:00:00Z', price: 8_000 },
    { timestamp: '2025-03-02T08:00:00Z', price: 6_000 },
    { timestamp: '2025-03-02T09:00:00Z', price: 5_000 },
    { timestamp: '2025-03-02T10:00:00Z', price: 4_000 },
  ],
  '2025-03-03': [
    { timestamp: '2025-03-03T00:00:00Z', price: 5_000 },
    { timestamp: '2025-03-03T01:00:00Z', price: 5_000 },
    { timestamp: '2025-03-03T02:00:00Z', price: 5_000 },
  ],
  '2025-03-04': [
    { timestamp: '2025-03-04T00:00:00Z', price: 10_000 },
    { timestamp: '2025-03-04T01:00:00Z', price: 13_000 },
    { timestamp: '2025-03-04T02:00:00Z', price: 9_000 },
    { timestamp: '2025-03-04T03:00:00Z', price: 11_000 },
    { timestamp: '2025-03-04T04:00:00Z', price: 19_500 },
    { timestamp: '2025-03-04T05:00:00Z', price: 12_000 },
  ],
};

export const inMemoryTradeInfoMock = {
  '2025-03-01': () =>
    findMostProfitableTrade(inMemoryPricePointsMock['2025-03-01']),
  '2025-03-02': () =>
    findMostProfitableTrade(inMemoryPricePointsMock['2025-03-02']),
  '2025-03-03': () =>
    findMostProfitableTrade(inMemoryPricePointsMock['2025-03-03']),
  '2025-03-04': () =>
    findMostProfitableTrade(inMemoryPricePointsMock['2025-03-04']),
};
