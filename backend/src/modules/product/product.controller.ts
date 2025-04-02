import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  AddProductDTO,
  OrderHistQuery,
  ProductQuery,
} from './interfaces/product.interfaces';
import {
  AddCategoryDTO,
  CategoryQuery,
} from './interfaces/category.interfaces';
import { AddToCartDTO } from './interfaces/cart.interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../user/user.decorator';
import UserEntity from '../user/user.entity';

@Controller('product')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('v1/products')
  getAllProducts(@Query() prodsQuery: ProductQuery) {
    if (
      prodsQuery.min_price &&
      prodsQuery.max_price &&
      prodsQuery.min_price > prodsQuery.max_price
    ) {
      throw new HttpException('invalid min-max price', 400);
    }

    if (prodsQuery.categories && !Array.isArray(prodsQuery.categories))
      prodsQuery.categories = [prodsQuery.categories];

    return this.productService.getAllProducts(prodsQuery);
  }

  @Get('v1/products/:id')
  getProductById(@Param('id') id: number) {
    if (!id) throw new HttpException('no id provided', 400);
    if (isNaN(id)) throw new HttpException('invalid id', 400);

    return this.productService.getProductById(id);
  }

  @Get('v1/cart')
  @UseGuards(AuthGuard)
  getCartItems(@Query() cartQuery, @User() user: UserEntity) {
    return this.productService.getAllFromCart(user.id);
  }

  @Post('v1/cart')
  @UseGuards(AuthGuard)
  addToCart(@Body() cartBody: AddToCartDTO, @User() user: UserEntity) {
    return this.productService.addToCart(cartBody, user.id);
  }

  @Post('v1/checkout')
  @UseGuards(AuthGuard)
  checkout(@User() user: UserEntity) {
    return this.productService.checkout(user.id);
  }

  @Get('v1/orders')
  @UseGuards(AuthGuard)
  getOrderHistory(@Query() query: OrderHistQuery, @User() user: UserEntity) {
    return this.productService.getHistory(user.id, query);
  }

  @Get('v1/categories')
  getAllCategories(@Query() query: CategoryQuery) {
    return this.productService.getAllCategories(query);
  }

  @Post('v1/categories')
  @UseGuards(AuthGuard)
  addNewCategory(@Body() category: AddCategoryDTO, @User() user: UserEntity) {
    return this.productService.addNewCategory(category.name);
  }

  @Post('v1/admin/products')
  @UseGuards(AuthGuard)
  addNewProduct(@Body() productBody: AddProductDTO) {
    console.log(productBody);
    if (!Array.isArray(productBody?.categories))
      productBody.categories = [productBody.categories];

    return this.productService.addNewProduct(productBody);
  }

  @Put('v1/admin/products/:id')
  @UseGuards(AuthGuard)
  editProduct(@Body() productBody, @Param('id') productId: number) {
    throw new HttpException('method not implemented', 400);
  }

  @Put('v1/admin/orders/:id')
  @UseGuards(AuthGuard)
  editOrder(@Body() orderBody, @Param('id') orderId: number) {}

  @Get('v1/image')
  getImage(@Query('id') id: number) {
    return this.productService.shareImage(id);
  }
}
