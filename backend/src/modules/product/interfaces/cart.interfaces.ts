import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddToCartDTO {
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'invalid product' },
  )
  @IsNotEmpty()
  @Type(() => Number)
  product_id: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'invalid quantity' },
  )
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;
}
