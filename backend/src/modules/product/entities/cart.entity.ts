import {
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import UserEntity from '../../user/user.entity';

@Entity({
  name: 'Cart',
})
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity, (prod) => prod.cart, { eager: true })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  products: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.cart)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'boolean', default: false })
  is_processed: boolean;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;

  @AfterUpdate()
  updateMaterialedView(ds) {
    // getRepository(MyMaterializedView)
    //   .query('REFRESH MATERIALIZED VIEW materialized_view')
    //   .then((resp) => console.log('update materialized view ok'))
    //   .catch((err) => console.error('update materialized view error'));
  }
}
