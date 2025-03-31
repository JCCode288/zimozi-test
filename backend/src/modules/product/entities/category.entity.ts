import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({
  name: 'Category',
})
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: '255' })
  name: string;

  @ManyToMany(() => ProductEntity, (prod) => prod.categories)
  @JoinTable({
    name: 'ProductCategory',
    joinColumn: { name: 'category_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: ProductEntity[];

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}
