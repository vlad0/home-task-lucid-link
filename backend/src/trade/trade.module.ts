import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { PriceDataService } from './price-data.service';

@Module({
  controllers: [TradeController],
  providers: [TradeService, PriceDataService],
})
export class TradeModule { }
