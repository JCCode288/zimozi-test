import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { PaginationQuery } from '../../interfaces/response.interfaces';

export class AddCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, { message: 'maximum length is 255 character' })
  name: string;
}

export type EditCategoryDTO = Partial<AddCategoryDTO>;

export class CategoryQuery {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(1, 255, { message: 'maximum length is 255 character' })
  name: string;
}
