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
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductDTO, ProductQuery } from './interfaces/product.interfaces';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AddCategoryDTO } from './interfaces/category.interfaces';

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
  getCartItems(@Query() cartQuery) {
    const userId = 1; // change to get from auth
    return this.productService.getAllFromCart(userId);
  }

  @Post('v1/cart')
  addToCart(@Body() productBody) {
    const userId = 1; // change to get from auth
    return this.productService.addToCart(productBody.id, userId);
  }

  @Get('v1/categories')
  getAllCategories(@Query('name') name?: string) {
    return this.productService.getAllCategories(name);
  }

  @Post('v1/categories')
  addNewCategory(@Body() category: AddCategoryDTO) {
    return this.productService.addNewCategory(category.name);
  }

  @Post('v1/admin/products')
  @UseInterceptors(FilesInterceptor('images'))
  addNewProduct(
    @Body() productBody: AddProductDTO,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    if (!Array.isArray(productBody?.categories))
      productBody.categories = [productBody.categories];

    productBody.images = images;

    console.log(productBody);

    return this.productService.addNewProduct(productBody);
  }

  @Put('v1/admin/products/:id')
  editProduct(@Body() productBody, @Param('id') productId: number) {
    throw new HttpException('method not implemented', 400);
  }

  @Put('v1/admin/orders/:id')
  editOrder(@Body() orderBody, @Param('id') orderId: number) {}

  @Get('v1/image')
  getImage(@Query('id') id: number) {
    return this.productService.shareImage(id);
  }
}
