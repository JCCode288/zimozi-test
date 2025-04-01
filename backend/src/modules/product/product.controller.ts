import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  AddProductDTO,
  OrderHistQuery,
  ProductQuery,
} from './interfaces/product.interfaces';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  AddCategoryDTO,
  CategoryQuery,
} from './interfaces/category.interfaces';
import { AddToCartDTO } from './interfaces/cart.interfaces';
import { AuthGuard } from '../auth/auth.guard';

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
  getCartItems(@Query() cartQuery) {
    const userId = 2; // change to get from auth
    return this.productService.getAllFromCart(userId);
  }

  @Post('v1/cart')
  @UseGuards(AuthGuard)
  addToCart(@Body() cartBody: AddToCartDTO) {
    const userId = 2; // change to get from auth
    return this.productService.addToCart(cartBody, userId);
  }

  @Post('v1/checkout')
  @UseGuards(AuthGuard)
  checkout() {
    const userId = 2; // change to get from auth
    return this.productService.checkout(userId);
  }

  @Get('v1/orders')
  @UseGuards(AuthGuard)
  getOrderHistory(@Query() query: OrderHistQuery) {
    const userId = 1;
    return this.productService.getHistory(userId, query);
  }

  @Get('v1/categories')
  getAllCategories(@Query() query: CategoryQuery) {
    return this.productService.getAllCategories(query);
  }

  @Post('v1/categories')
  addNewCategory(@Body() category: AddCategoryDTO) {
    return this.productService.addNewCategory(category.name);
  }

  @Post('v1/admin/products')
  @UseInterceptors(FilesInterceptor('images'))
  @UseGuards(AuthGuard)
  addNewProduct(
    @Body() productBody: AddProductDTO,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    if (!Array.isArray(productBody?.categories))
      productBody.categories = [productBody.categories];

    productBody.images = images;

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
