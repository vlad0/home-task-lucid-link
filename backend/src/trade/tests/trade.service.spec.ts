import { Test, TestingModule } from '@nestjs/testing';
import { PriceDataService } from '../price-data.service';
import { PriceDataRepository } from '../price-data.repository';
import { mock, mockDeep } from 'jest-mock-extended';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  mockJan01,
  mockJan02,
  mockJan03,
  mockJan04,
  mockJan05,
  mockJan06,
  priceData,
  priceDataDoubleVUptrend,
  priceDataMform,
  priceDataNoRecommendationDowntrend,
  priceDataNoRecommendationFlatLine,
  priceDataReverseV,
  priceDataSform,
  priceDataSformMostRecent,
  priceDataSformMostRecentShortest,
  priceDataSformMostRecentShortestVol2,
  priceDataUptrend,
  priceDataVForm,
} from './mock';
import { TradeService } from '../trade.service';

describe('Trade Service', () => {
  let tradeService: TradeService;
  let getDailyCandleSpy: jest.SpyInstance;
  const repositoryMock = mock<PriceDataRepository>();
  const cacheMock = mockDeep<Cache>();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradeService,
        PriceDataService,
        PriceDataRepository,
        {
          provide: CACHE_MANAGER,
          useValue: cacheMock,
        },
      ],
    })
      .overrideProvider(PriceDataRepository)
      .useValue(repositoryMock)
      .compile();

    tradeService = module.get<TradeService>(TradeService);
    const priceDataService = module.get<PriceDataService>(PriceDataService);
    getDailyCandleSpy = jest.spyOn(priceDataService, 'getDailyCandle');
  });

  describe('Calculate best trade within a single day', () => {
    const subject = (start: string, end: string) =>
      tradeService.findBestTrade(new Date(start), new Date(end));

    it('should calculate most profitable trade - basic scenario', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(priceData);

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T05:00Z');

      expect(result).toEqual({
        buyTime: '2025-03-01T01:00:00Z',
        buyPrice: 14000,
        sellTime: '2025-03-01T04:00:00Z',
        sellPrice: 18000,
        maxProfit: 4000,
        maxPrice: 18000,
        maxTime: '2025-03-01T04:00:00Z',
        minPrice: 12000,
        minTime: '2025-03-01T05:00:00Z',
      });
    });

    it('should calculate most profitable trade for S form', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(priceDataSform);

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T05:00Z');

      expect(result).toEqual({
        buyTime: '2025-03-01T02:00:00Z',
        buyPrice: 9000,
        sellTime: '2025-03-01T05:00:00Z',
        sellPrice: 12000,
        maxProfit: 3000,
        maxPrice: 12000,
        maxTime: '2025-03-01T05:00:00Z',
        minPrice: 9000,
        minTime: '2025-03-01T02:00:00Z',
      });
    });

    it('should calculate most profitable trade and MOST RECENT for S form', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(priceDataSformMostRecent);

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T23:00Z');

      expect(result).toEqual({
        buyTime: '2025-03-01T00:00:00Z',
        buyPrice: 10000,
        sellTime: '2025-03-01T01:00:00Z',
        sellPrice: 13000,
        maxProfit: 3000,
        maxPrice: 13000,
        maxTime: '2025-03-01T01:00:00Z',
        minPrice: 9000,
        minTime: '2025-03-01T02:00:00Z',
      });
    });

    it('should calculate most profitable trade and earliest and shortest for S form', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(
        priceDataSformMostRecentShortest,
      );

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T23:00Z');

      expect(result).toEqual({
        buyTime: '2025-03-01T08:00:00Z',
        buyPrice: 9000,
        sellTime: '2025-03-01T09:00:00Z',
        sellPrice: 12000,
        maxProfit: 3000,
        maxPrice: 12000,
        maxTime: '2025-03-01T09:00:00Z',
        minPrice: 9000,
        minTime: '2025-03-01T08:00:00Z',
      });
    });

    it('should calculate most profitable trade and earliest and shortest for S form vol 2', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(
        priceDataSformMostRecentShortestVol2,
      );

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T23:00Z');

      expect(result).toEqual({
        buyTime: '2025-03-01T05:00:00Z',
        buyPrice: 9000,
        sellTime: '2025-03-01T06:00:00Z',
        sellPrice: 12000,
        maxProfit: 3000,
        maxPrice: 12000,
        maxTime: '2025-03-01T09:00:00Z',
        minPrice: 9000,
        minTime: '2025-03-01T08:00:00Z',
      });
    });

    it('should calculate most profitable trade for Uptrend', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(priceDataUptrend);

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T05:00Z');

      expect(result).toEqual({
        buyTime: '2025-03-01T00:00:00Z',
        buyPrice: 5000,
        sellTime: '2025-03-01T05:00:00Z',
        sellPrice: 10000,
        maxProfit: 5000,
        maxPrice: 10000,
        maxTime: '2025-03-01T05:00:00Z',
        minPrice: 5000,
        minTime: '2025-03-01T00:00:00Z',
      });
    });

    it('should calculate most profitable trade for V form', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(priceDataVForm);

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T05:00Z');

      expect(result).toEqual({
        buyTime: '2025-03-01T03:00:00Z',
        buyPrice: 8000,
        sellTime: '2025-03-01T05:00:00Z',
        sellPrice: 10000,
        maxProfit: 2000,
        maxPrice: 10000,
        maxTime: '2025-03-01T05:00:00Z',
        minPrice: 8000,
        minTime: '2025-03-01T03:00:00Z',
      });
    });

    it('should calculate most profitable trade for reverse V form', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(priceDataReverseV);

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T06:00Z');

      expect(result).toEqual({
        buyTime: '2025-03-01T00:00:00Z',
        buyPrice: 8000,
        sellTime: '2025-03-01T02:00:00Z',
        sellPrice: 10000,
        maxProfit: 2000,
        maxPrice: 10000,
        maxTime: '2025-03-01T02:00:00Z',
        minPrice: 6000,
        minTime: '2025-03-01T06:00:00Z',
      });
    });

    it('should calculate most profitable trade for double V form uptrend', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(priceDataDoubleVUptrend);

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T10:00Z');

      expect(result).toEqual({
        buyTime: '2025-03-01T03:00:00Z',
        buyPrice: 8000,
        sellTime: '2025-03-01T10:00:00Z',
        sellPrice: 12000,
        maxProfit: 4000,
        maxPrice: 17000,
        maxTime: '2025-03-01T00:00:00Z',
        minPrice: 8000,
        minTime: '2025-03-01T03:00:00Z',
      });
    });

    it('should calculate most profitable trade for M form', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(priceDataMform);

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T10:00Z');

      expect(result).toEqual({
        buyTime: '2025-03-01T00:00:00Z',
        buyPrice: 5000,
        sellTime: '2025-03-01T04:00:00Z',
        sellPrice: 9000,
        maxProfit: 4000,
        maxPrice: 9000,
        maxTime: '2025-03-01T09:00:00Z',
        minPrice: 4000,
        minTime: '2025-03-01T10:00:00Z',
      });
    });

    it('should provide the earliest trade for flat line', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(
        priceDataNoRecommendationFlatLine,
      );

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T23:00Z');

      expect(result).toEqual({
        status: 'NO_PROFITABLE_TRADE',
      });
    });

    it('should provide the earliest trade for downtrend', async () => {
      repositoryMock.fetch.mockResolvedValueOnce(
        priceDataNoRecommendationDowntrend,
      );

      const result = await subject('2025-03-01T00:00Z', '2025-03-01T23:00Z');

      expect(result).toEqual({
        status: 'NO_PROFITABLE_TRADE',
      });
    });
  });

  describe('Calculate best trade for multiple days', () => {
    const subject = (start: string, end: string) =>
      tradeService.findBestTrade(new Date(start), new Date(end));

    beforeEach(() => {
      repositoryMock.fetch
        .calledWith('2025-01-01')
        .mockResolvedValueOnce(mockJan01);
      repositoryMock.fetch
        .calledWith('2025-01-02')
        .mockResolvedValueOnce(mockJan02);
      repositoryMock.fetch
        .calledWith('2025-01-03')
        .mockResolvedValueOnce(mockJan03);
      repositoryMock.fetch
        .calledWith('2025-01-04')
        .mockResolvedValueOnce(mockJan04);
      repositoryMock.fetch
        .calledWith('2025-01-05')
        .mockResolvedValueOnce(mockJan05);
      repositoryMock.fetch
        .calledWith('2025-01-06')
        .mockResolvedValueOnce(mockJan06);
    });

    it('should calculate most profitable trade - basic scenario', async () => {
      const result = await subject('2025-01-01T00:00Z', '2025-01-04T05:00Z');

      expect(getDailyCandleSpy).toHaveBeenCalledWith('2025-01-02');
      expect(getDailyCandleSpy).toHaveBeenCalledWith('2025-01-03');

      expect(result).toEqual({
        buyTime: '2025-01-01T03:00:00Z',
        buyPrice: 7000,
        sellTime: '2025-01-02T00:00:00Z',
        sellPrice: 20000,
        maxProfit: 13000,
        maxPrice: 20000,
        maxTime: '2025-01-02T00:00:00Z',
        minPrice: 7000,
        minTime: '2025-01-01T03:00:00Z',
      });
    });

    it('should calculate most profitable trade - basic scenario', async () => {
      const result = await subject('2025-01-01T00:00Z', '2025-01-04T05:00Z');

      expect(getDailyCandleSpy).toHaveBeenCalledTimes(2);
      expect(getDailyCandleSpy).toHaveBeenCalledWith('2025-01-02');
      expect(getDailyCandleSpy).toHaveBeenCalledWith('2025-01-03');

      expect(result).toEqual({
        buyTime: '2025-01-01T03:00:00Z',
        buyPrice: 7000,
        sellTime: '2025-01-02T00:00:00Z',
        sellPrice: 20000,
        maxProfit: 13000,
        maxPrice: 20000,
        maxTime: '2025-01-02T00:00:00Z',
        minPrice: 7000,
        minTime: '2025-01-01T03:00:00Z',
      });
    });

    it('should calculate most profitable trade - W form', async () => {
      const result = await subject('2025-01-02T04:00Z', '2025-01-04T05:00Z');

      expect(getDailyCandleSpy).toHaveBeenCalledTimes(1);
      expect(getDailyCandleSpy).toHaveBeenCalledWith('2025-01-03');

      expect(result).toEqual({
        buyTime: '2025-01-03T02:00:00Z',
        buyPrice: 9000,
        sellTime: '2025-01-04T04:00:00Z',
        sellPrice: 19500,
        maxProfit: 10500,
        maxPrice: 19500,
        maxTime: '2025-01-04T04:00:00Z',
        minPrice: 9000,
        minTime: '2025-01-04T02:00:00Z',
      });
    });
  });
});
