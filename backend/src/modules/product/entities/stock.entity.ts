import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({
  name: 'Stock',
})
export class StockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  stock: number;

  @OneToOne(() => ProductEntity, (prod) => prod.stock)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}
