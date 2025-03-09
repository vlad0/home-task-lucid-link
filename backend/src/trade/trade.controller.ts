import {
  Controller,
  Get,
  ParseDatePipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('trade')
@UseInterceptors(CacheInterceptor)
export class TradeController {
  constructor(private readonly tradeService: TradeService) { }
  @Get()
  @CacheTTL(10_000)
  getTradeInfo(
    @Query('start', new ParseDatePipe()) start: Date,
    @Query('end', new ParseDatePipe()) end: Date,
  ) {
    return this.tradeService.findBestTrade(start, end);
  }
}
