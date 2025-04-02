import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import AdminEntity from './admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
