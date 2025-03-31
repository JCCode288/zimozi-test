import { Module, UsePipes, ValidationPipe } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { DataSourceOptions } from 'typeorm';
import { AuthModule } from './modules/auth/auth.module';

const modules = [ProductModule, AuthModule];

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    async useFactory() {
      const config: DataSourceOptions = {
        type: 'postgres',
        host: process.env.DB_HOST!,
        username: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        port: +process.env.DB_PORT!,
        database: process.env.DB_NAME!,
        ssl: !(process.env.NODE_ENV === 'development'),
        synchronize: process.env.NODE_ENV === 'development',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      };
      return config;
    },
  }),

  ...modules,
];
const controllers = [AppController];
const providers = [AppService];

const Metadata: ModuleMetadata = {
  imports,
  controllers,
  providers,
};

@Module(Metadata)
export class AppModule {}
