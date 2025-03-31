import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './user.entity';

@Module({
  imports: [AdminModule, TypeOrmModule.forFeature([UserEntity])],
  exports: [AdminModule, UserService],
  providers: [UserService],
})
export class UserModule {}
