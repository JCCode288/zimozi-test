import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
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
  @IsNotEmpty()
  price: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'invalid stock' },
  )
  @IsNotEmpty()
  stock: number;

  @IsOptional()
  @IsInt({ each: true, message: 'invalid category' })
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
  @Type(() => Number)
  max_price?: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'invalid min price' },
  )
  @IsOptional()
  @Type(() => Number)
  min_price?: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'invalid categories id', each: true },
  )
  @IsOptional()
  @Type(() => Number)
  categories?: number[];
}
