import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { PriceDataService } from './price-data.service';
import { PriceDataRepository } from './price-data.repository';

@Module({
  controllers: [TradeController],
  providers: [TradeService, PriceDataService, PriceDataRepository],
})
export class TradeModule { }
