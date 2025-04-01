import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartEntity } from '../product/entities/cart.entity';
import AdminEntity from './admin/admin.entity';

@Entity({
  name: 'User',
})
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  uid: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @OneToMany(() => CartEntity, (cart) => cart.user)
  cart: CartEntity[];

  @OneToOne(() => AdminEntity, (adm) => adm.user, { cascade: true })
  admin: AdminEntity;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}
