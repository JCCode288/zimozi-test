import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({
  name: 'Image',
})
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  url: string;

  @Column({ type: 'int', nullable: false })
  type: number;

  @ManyToOne(() => ProductEntity, (prod) => prod.images)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}
