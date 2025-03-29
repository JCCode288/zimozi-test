import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './user.entity';

@Module({
  imports: [
    AdminModule,
    CustomerModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [AdminModule, CustomerModule, UserService],
  providers: [UserService],
})
export class UserModule {}
