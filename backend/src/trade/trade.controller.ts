import { Controller, Get, ParseDatePipe, Query } from '@nestjs/common';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) { }
  @Get()
  getTradeInfo(
    @Query('start', new ParseDatePipe()) start: Date,
    @Query('end', new ParseDatePipe()) end: Date,
  ) {
    return this.tradeService.findBestTrade(new Date(start), new Date(end));
  }
}
