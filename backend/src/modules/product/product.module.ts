import { Module, OnModuleInit } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { CategoryEntity } from './entities/category.entity';
import { ImageEntity } from './entities/image.entity';
import { ProductEntity } from './entities/product.entity';
import { StockEntity } from './entities/stock.entity';
import { existsSync, mkdir } from 'fs';
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
export class ProductModule implements OnModuleInit {
  onModuleInit() {
    try {
      const assetPath = __dirname + '/assets';

      if (existsSync(assetPath))
        return console.log('path is exists: ', assetPath);

      mkdir(assetPath, (err) => {
        if (err) throw err;
        console.log('created path: ', assetPath);
      });
    } catch (err) {
      console.error(err, '<<< ERROR ON INIT PRODUCT');
    }
  }
}
