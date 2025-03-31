import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class AddProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'invalid price' },
  )
  @IsPositive({ message: 'price cannot be negative' })
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'invalid stock' },
  )
  @IsPositive({ message: 'stock cannot be negative' })
  @IsNotEmpty()
  @Type(() => Number)
  stock: number;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { each: true, message: 'invalid category' },
  )
  @IsPositive({ message: 'invalid category', each: true })
  @Type(() => Number)
  categories: number[];

  images: Express.Multer.File[];
}

export type EditProductDTO = Partial<AddProductDTO> & { updated_at: Date };

export class ProductQuery {
  @IsString({ message: 'invalid name' })
  @IsOptional()
  name?: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'invalid max price' },
  )
  @IsOptional()
  @IsPositive({ message: 'price cannot be negative' })
  @Type(() => Number)
  max_price?: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'invalid min price' },
  )
  @IsOptional()
  @IsPositive({ message: 'price cannot be negative' })
  @Type(() => Number)
  min_price?: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'invalid categories id', each: true },
  )
  @IsOptional()
  @IsPositive({ message: 'invalid category', each: true })
  @Type(() => Number)
  categories?: number[];
}
