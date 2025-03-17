import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PraseUtcDatePipe } from '../common/prase-utc-date.pipe';
import { plainToInstance } from 'class-transformer';
import { TradeResponseDto } from './types/TradeResponse.dto';

@Controller('trade')
@UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
export class TradeController {
  constructor(private readonly tradeService: TradeService) { }
  @Get()
  @CacheTTL(10_000)
  @SerializeOptions({
    strategy: 'excludeAll',
  })
  async getTradeInfo(
    @Query('start', new PraseUtcDatePipe()) start: Date,
    @Query('end', new PraseUtcDatePipe()) end: Date,
  ) {
    const trade = await this.tradeService.findBestTrade(start, end);
    return plainToInstance(TradeResponseDto, trade);
  }
}
