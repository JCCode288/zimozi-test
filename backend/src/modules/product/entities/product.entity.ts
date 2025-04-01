import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockEntity } from './stock.entity';
import { CategoryEntity } from './category.entity';
import { CartEntity } from './cart.entity';
import { ImageEntity } from './image.entity';

@Entity({
  name: 'Product',
})
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @OneToOne(() => StockEntity, (st) => st.product, {
    eager: true,
    cascade: true,
  })
  stock: StockEntity;

  @ManyToMany(() => CategoryEntity, (cat) => cat.products, {
    eager: true,
    cascade: true,
  })
  @JoinTable({
    name: 'ProductCategory',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: CategoryEntity[];

  @OneToMany(() => ImageEntity, (img) => img.product, { cascade: true })
  images: ImageEntity[];

  @OneToMany(() => CartEntity, (cart) => cart.products)
  cart: CartEntity[];

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}
