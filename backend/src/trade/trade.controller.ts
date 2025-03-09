import {
  BadRequestException,
  Controller,
  Get,
  ParseDatePipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PraseUtcDatePipe } from 'src/common/prase-utc-date.pipe';

@Controller('trade')
@UseInterceptors(CacheInterceptor)
export class TradeController {
  constructor(private readonly tradeService: TradeService) { }
  @Get()
  @CacheTTL(10_000)
  getTradeInfo(
    @Query('start', new PraseUtcDatePipe()) start: Date,
    @Query('end', new PraseUtcDatePipe()) end: Date,
  ) {
    return this.tradeService.findBestTrade(start, end);
  }
}
