import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import GlobalExceptionHandler from './modules/global/global.exception';
import { GlobalInterceptor } from './modules/global/global.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: [process.env.FE_URL!, '*'] },
  });
  app.setGlobalPrefix('/api');

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionHandler(httpAdapter));
  app.useGlobalInterceptors(new GlobalInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
