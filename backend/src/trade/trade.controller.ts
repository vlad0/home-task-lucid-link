import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { TradeService } from './trade.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PraseUtcDatePipe } from '../common/prase-utc-date.pipe';
import { TradeInfoResponse } from './types/TradeInfoResponse';

@Controller('trade')
@UseInterceptors(CacheInterceptor)
export class TradeController {
  constructor(private readonly tradeService: TradeService) { }
  @Get()
  @CacheTTL(10_000)
  getTradeInfo(
    @Query('start', new PraseUtcDatePipe()) start: Date,
    @Query('end', new PraseUtcDatePipe()) end: Date,
  ): Promise<TradeInfoResponse> {
    return this.tradeService.findBestTrade(start, end);
  }
}
