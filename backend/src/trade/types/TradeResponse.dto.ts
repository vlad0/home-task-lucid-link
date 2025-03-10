import { Expose } from 'class-transformer';

export class TradeResponseDto {
  @Expose()
  buyTime: string;
  @Expose()
  buyPrice: string;
  @Expose()
  sellTime: string;
  @Expose()
  sellPrice: string;

  @Expose()
  status: string;
}
