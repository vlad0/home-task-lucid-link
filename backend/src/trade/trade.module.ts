import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { PriceDataService } from './price-data.service';
import { PriceDataRepository } from './price-data.repository';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [TradeController],
  providers: [TradeService, PriceDataService, PriceDataRepository],
})
export class TradeModule { }
