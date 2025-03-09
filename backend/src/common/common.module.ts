import { Module } from '@nestjs/common';
import { PraseUtcDatePipe } from './prase-utc-date.pipe';

@Module({
  providers: [PraseUtcDatePipe],
})
export class CommonModule { }
