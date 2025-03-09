import { Module } from '@nestjs/common';
import { PraseUtcDatePipe } from './prase-utc-date.pipe';
import { GenericLogger } from './logger.service';

@Module({
  providers: [PraseUtcDatePipe, GenericLogger],
  exports: [GenericLogger],
})
export class CommonModule { }
