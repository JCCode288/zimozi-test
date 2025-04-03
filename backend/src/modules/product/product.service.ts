import { HttpException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from './entities/category.entity';
import { ImageEntity } from './entities/image.entity';
import { StockEntity } from './entities/stock.entity';
import { CartEntity } from './entities/cart.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  AddProductDTO,
  EditProductDTO,
  OrderHistQuery,
  ProductQuery,
} from './interfaces/product.interfaces';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { ViewOrderHistory } from './entities/order.entity';
import { AddToCartDTO } from './interfaces/cart.interfaces';
import { Pagination } from '../global/pagination.response';
import { CategoryQuery } from './interfaces/category.interfaces';

export enum RepoName {
  PRODUCT = 'product',
  CATEGORY = 'category',
  IMAGE = 'image',
  STOCK = 'stock',
  CART = 'cart',
}

@Injectable()
export class ProductService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
    @InjectRepository(StockEntity)
    private readonly stockRepo: Repository<StockEntity>,
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,
    @InjectRepository(ViewOrderHistory)
    private readonly orderRepo: Repository<ViewOrderHistory>,
  ) {}

  private readonly product_alias = 'product';
  private readonly category_alias = 'category';
  private readonly cart_alias = 'cart';
  private readonly stock_alias = 'stock';
  private readonly image_alias = 'image';
  private readonly basePath = __dirname + '/assets/';

  async getAllProducts({
    categories,
    min_price,
    max_price,
    name,
    limit,
    page,
  }: ProductQuery) {
    const builder = this.getRepo('product');

    builder
      .where('1=1')
      .leftJoinAndSelect(
        `${this.product_alias}.categories`,
        this.category_alias,
      )
      .leftJoinAndSelect(
        `${this.product_alias}.stock`,
        this.stock_alias,
        `${this.stock_alias}."stock" > '0'`,
      )
      .leftJoinAndSelect(
        `${this.product_alias}.images`,
        this.image_alias,
        `${this.image_alias}.type = '0'`,
      );

    if (categories) {
      builder.andWhere(`${this.category_alias}.id IN (:...categories)`, {
        categories,
      });
    }

    if (min_price) {
      builder.andWhere(`${this.product_alias}.price >= :min_price`, {
        min_price,
      });
    }

    if (max_price) {
      builder.andWhere(`${this.product_alias}.price <= :max_price`, {
        max_price,
      });
    }

    if (name) {
      name = '%' + name + '%';
      builder.andWhere(`${this.product_alias}.name ILIKE :name`, { name });
    }

    const [data, total_data] = await builder.getManyAndCount();
    const pagination = new Pagination(page, limit, total_data);

    return { data, pagination };
    // return data;
  }

  async getProductById(id: number) {
    return this.getRepo('product')
      .leftJoinAndSelect(
        `${this.product_alias}.categories`,
        this.category_alias,
      )
      .leftJoinAndSelect(`${this.product_alias}.stock`, this.stock_alias)
      .leftJoinAndSelect(`${this.product_alias}.images`, this.image_alias)
      .where(`${this.product_alias}.id = :id`, { id })
      .getOneOrFail();
  }

  async addNewProduct(productBody: AddProductDTO) {
    return this.dataSource.transaction(async (em) => {
      const prodData = new ProductEntity();

      prodData.name = productBody.name;
      prodData.description = productBody.description;
      prodData.price = productBody.price;

      const stock = new StockEntity();
      stock.stock = productBody.stock;
      prodData.stock = stock;

      prodData.categories = productBody.categories.map((c) => {
        const cat = new CategoryEntity();
        cat.id = c;

        return cat;
      });

      prodData.images =
        productBody.images?.map((im) => {
          const img = new ImageEntity();
          img.url = im;

          return img;
        }) ?? [];

      const product = await em.save(prodData);

      return this.getRepo('product', em)
        .select([`${this.product_alias}.name`, `${this.product_alias}.id`])
        .where(`${this.product_alias}.id = :id`, { id: product.id })
        .getOne();
    });
  }

  async editProduct(productBody: EditProductDTO, productId: number) {
    const productData: any = { ...productBody };

    if (productBody.categories) {
      productData.categories = productBody.categories.map((c) => ({ id: c }));
    }

    return this.getRepo('product')
      .update()
      .set(productData)
      .where('id = :productId', { productId })
      .execute();
  }

  async getAllFromCart(userId: number) {
    const builder = this.getRepo('product')
      .addSelect(
        `CAST(SUM(${this.cart_alias}.quantity) AS INT) as total_quantity`,
      )
      .leftJoin(`${this.product_alias}.cart`, this.cart_alias)
      .leftJoin(`${this.cart_alias}.user`, 'user')
      .leftJoinAndMapOne(
        `${this.product_alias}.images`,
        `${this.product_alias}.images`,
        this.image_alias,
        `${this.image_alias}.type = '0'`,
      )
      .where(`${this.cart_alias}.is_processed = false`)
      .andWhere('user.id = :userId', { userId })
      .groupBy(`${this.product_alias}.id`)
      .addGroupBy(`${this.image_alias}.id`)
      .addGroupBy(`user.id`);

    const datas = await builder.execute();

    let cart_total = 0;
    const cart_items = datas.map((d) => {
      d.total_price = d.total_quantity * d.product_price;
      cart_total += d.total_price;

      const data = {};
      for (const key in d) {
        const [main, ...rest] = key.split('_');

        if (!data[main]) data[main] = {};

        const joinKey = rest.join('_');

        data[main][joinKey] = d[key];
      }

      return data;
    });

    return { cart_items, cart_total };
  }

  async addToCart(cartBody: AddToCartDTO, user_id: number) {
    const product_id = cartBody.product_id;

    const product = await this.getRepo('product')
      .where('id = :product_id', {
        product_id,
      })
      .getOne();

    if (!product) throw new HttpException('product not found', 404);

    const data = await this.getRepo('cart')
      .insert()
      .values({
        user: { id: user_id },
        products: { id: product_id } as any,
        quantity: cartBody.quantity,
      })
      .execute();

    if (!data.generatedMaps.length)
      throw new HttpException('failed to add into cart', 500);

    return data.generatedMaps[0];
  }

  async checkout(user_id: number) {
    const data = await this.getRepo('cart')
      .update()
      .set({ is_processed: true })
      .where('user_id = :user_id', { user_id })
      .andWhere('is_processed = false')
      .returning('*')
      .execute();

    if (!data.raw.length) throw new HttpException('failed to checkout', 500);

    return data.raw[0];
  }

  async getAllCategories({ name }: CategoryQuery) {
    const builder = this.getRepo('category');

    if (name) {
      builder.where(`${this.category_alias}.name ILIKE '%:category%'`, {
        name,
      });
    }

    const [data, total_data] = await builder.getManyAndCount();

    // const pagination = new Pagination(page, limit, total_data);

    return data;
  }

  async addNewCategory(name: string) {
    const res = await this.getRepo('category')
      .insert()
      .values({ name })
      .returning('*')
      .execute();

    return res.generatedMaps[0];
  }

  async getHistory(
    user_id: number,
    { limit, page, min_date, max_date }: OrderHistQuery,
  ) {
    const builder = this.orderRepo
      .createQueryBuilder('order')
      .where('user_id = :user_id', { user_id })
      .limit(limit)
      .offset((page - 1) * limit);

    if (min_date) {
      builder.andWhere('order.order_date >= :min_date', { min_date });
    }
    if (max_date) {
      builder.andWhere('order.order_date >= :max_date', { max_date });
    }

    const [datas, total_data] = await builder.getManyAndCount();
    const data = datas.map((d) => {
      d.total_price = d.total_quantity * d.product_price;

      const data = {};
      for (const key in d) {
        const [main, ...rest] = key.split('_');

        if (main !== 'product' && main !== 'total') {
          data[key] = d[key];
          continue;
        }

        if (!data[main]) data[main] = {};

        const joinKey = rest.join('_');

        data[main][joinKey] = d[key];
      }

      return data;
    });

    const pagination = new Pagination(page, limit, total_data);

    return { data, pagination };
  }

  async shareImage(imageId: number) {
    const image = (await this.getRepo('image')
      .select(`${this.image_alias}.url`)
      .where('id = :imageId', {
        imageId,
      })
      .getOne()) as ImageEntity;

    if (!image || !image.url) throw new HttpException('image not found', 404);

    const path = this.basePath + image.url;

    if (!existsSync(path)) throw new HttpException('image not found', 404);

    return readFile(path);
  }

  // private mapFileImage(images: Express.Multer.File[]) {
  //   const mappedImages = images.map(async (im, idx) => {
  //     const url = `${im.originalname}-${new Date().getTime()}`;
  //     await writeFile(this.basePath + url, im.buffer)
  //       .then(console.log)
  //       .catch(console.error);

  //     const image = new ImageEntity();
  //     image.name = im.originalname;
  //     image.type = idx;
  //     image.url = url;

  //     return image;
  //   });

  //   return Promise.all(mappedImages);
  // }

  private getRepo(name: `${RepoName}`, entityManager?: EntityManager) {
    switch (name) {
      case RepoName.PRODUCT:
        return this.productRepo.createQueryBuilder(
          this.product_alias,
          entityManager?.queryRunner,
        );
      case RepoName.CATEGORY:
        return this.categoryRepo.createQueryBuilder(
          this.category_alias,
          entityManager?.queryRunner,
        );
      case RepoName.CART:
        return this.cartRepo.createQueryBuilder(
          this.cart_alias,
          entityManager?.queryRunner,
        );
      case RepoName.STOCK:
        return this.stockRepo.createQueryBuilder(
          this.stock_alias,
          entityManager?.queryRunner,
        );
      case RepoName.IMAGE:
        return this.imageRepo.createQueryBuilder(
          this.image_alias,
          entityManager?.queryRunner,
        );

      default:
        throw new HttpException('invalid repo name', 500);
    }
  }
}
