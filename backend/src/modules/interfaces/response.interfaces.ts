import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

enum PaginationLimit {
  'LOW' = 5,
  'MID' = 10,
  'HIGH' = 15,
}

export class PaginationQuery {
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'invalid page' },
  )
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'invalid page' },
  )
  @IsOptional()
  @IsEnum(PaginationLimit, { message: 'invalid limit' })
  @IsPositive()
  @Type(() => Number)
  limit: PaginationLimit = PaginationLimit.LOW;
}
