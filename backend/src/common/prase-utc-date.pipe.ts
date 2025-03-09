import { UTCDate } from '@date-fns/utc';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PraseUtcDatePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(
        `Query param *${metadata.data}* is required`,
      );
    }

    if (!UTCDate.parse(value)) {
      throw new BadRequestException(
        `Provided value *${value.slice(0, 30)}...* for *${metadata.data}* param is not valid format for date`,
      );
    }

    return new UTCDate(value);
  }
}
