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
  ProductQuery,
} from './interfaces/product.interfaces';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { ViewOrderHistory } from './entities/order.entity';

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

    return builder.getManyAndCount();
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

      prodData.images = await this.mapFileImage(productBody.images); //image type not handled
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
    return this.getRepo('cart')
      .leftJoin(`${this.cart_alias}.user`, 'u')
      .innerJoin(`${this.cart_alias}.products`, this.product_alias)
      .where(`${this.cart_alias}.is_processed = false`)
      .andWhere('u.id = :userId', { userId })
      .getMany();
  }

  async addToCart(product_id: number, user_id: number) {
    return this.getRepo('cart')
      .insert()
      .values({
        user: { id: user_id },
        product: { id: product_id },
      })
      .execute();
  }

  async checkout(user_id: number) {
    return this.getRepo('cart')
      .update()
      .set({ is_processed: true })
      .where('user_id = :user_id', { user_id })
      .execute();
  }

  async getAllCategories(category?: string) {
    const builder = this.getRepo('category');

    if (category) {
      builder.where(`${this.category_alias}.name ILIKE '%:category%'`, {
        category,
      });
    }

    return builder.getManyAndCount();
  }

  async addNewCategory(name: string) {
    const res = await this.getRepo('category')
      .insert()
      .values({ name })
      .returning('*')
      .execute();

    return res.generatedMaps[0];
  }

  async getHistory(user_id: number) {
    const builder = this.orderRepo.createQueryBuilder('or');

    return builder.getManyAndCount();
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

  private mapFileImage(images: Express.Multer.File[]) {
    const mappedImages = images.map(async (im, idx) => {
      const url = `${im.originalname}-${new Date().getTime()}`;
      await writeFile(this.basePath + url, im.buffer)
        .then(console.log)
        .catch(console.error);

      const image = new ImageEntity();
      image.name = im.originalname;
      image.type = idx;
      image.url = url;

      return image;
    });

    return Promise.all(mappedImages);
  }

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
