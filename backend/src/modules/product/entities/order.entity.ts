import { View, ViewColumn, ViewEntity } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from './product.entity';
import { StockEntity } from './stock.entity';
import { ImageEntity } from './image.entity';
import { CategoryEntity } from './category.entity';
import UserEntity from '../../user/user.entity';

@ViewEntity({
  expression: (ds) => {
    const builder = ds.getRepository(CartEntity).createQueryBuilder('crt');

    builder
      .select([
        'crt.quantity AS quantity',
        'crt.created_at AS ordered_at',
        'user.id',
      ])
      .leftJoinAndSelect(
        ProductEntity,
        'product',
        '"crt"."product_id" = "product"."id"',
      )
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoin('crt.user', 'user')
      .where('"crt"."is_processed" = true');

    return builder;
  },
})
export class ViewOrderHistory {
  @ViewColumn()
  quantity: number;

  @ViewColumn()
  product_id: number;

  @ViewColumn()
  product_name: string;

  @ViewColumn()
  product_description: string;

  @ViewColumn()
  product_price: number;

  @ViewColumn()
  product_categories: CategoryEntity[];

  @ViewColumn()
  user_id: number;

  @ViewColumn()
  created_at: Date;

  @ViewColumn()
  updated_at: Date;

  @ViewColumn()
  ordered_at: Date;
}
