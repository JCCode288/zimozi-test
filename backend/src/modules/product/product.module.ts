import { Module, OnModuleInit } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { CategoryEntity } from './entities/category.entity';
import { ImageEntity } from './entities/image.entity';
import { ProductEntity } from './entities/product.entity';
import { StockEntity } from './entities/stock.entity';
import { ViewOrderHistory } from './entities/order.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      CategoryEntity,
      ImageEntity,
      ProductEntity,
      StockEntity,
      ViewOrderHistory,
    ]),
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
