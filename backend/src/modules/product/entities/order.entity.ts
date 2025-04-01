import { ViewColumn, ViewEntity } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from './category.entity';

@ViewEntity({
  expression: (ds) => {
    const builder = ds.getRepository(CartEntity).createQueryBuilder('crt');

    builder
      .select([
        'CAST(SUM(crt.quantity) AS INT) AS total_quantity',
        'CAST(SUM(crt.quantity) * product.price AS INT) total_price',
        'crt.updated_at AS ordered_at',
        'user.id',
      ])
      .leftJoinAndSelect(
        ProductEntity,
        'product',
        '"crt"."product_id" = "product"."id"',
      )
      .leftJoin('crt.user', 'user')
      .where('"crt"."is_processed" = true')
      .groupBy('"product".id')
      .addGroupBy('user.id')
      .addGroupBy('crt.updated_at');

    return builder;
  },
})
export class ViewOrderHistory {
  @ViewColumn()
  product_id: number;

  @ViewColumn()
  product_name: string;

  @ViewColumn()
  total_quantity: number;

  @ViewColumn()
  total_price: number;

  @ViewColumn()
  product_description: string;

  @ViewColumn()
  product_price: number;

  @ViewColumn()
  user_id: number;

  @ViewColumn()
  ordered_at: Date;
}
