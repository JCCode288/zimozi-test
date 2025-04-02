import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import GlobalExceptionHandler from './modules/global/global.exception';
import { GlobalInterceptor } from './modules/global/global.interceptor';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { ExpressAdapter } from '@nestjs/platform-express';
import 'reflect-metadata';

const expressServer = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressServer),
    {
      logger: ['warn', 'error', 'fatal', 'log', 'verbose', 'debug'],
    },
  );
  app.enableCors();
  app.setGlobalPrefix('/api');

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionHandler(httpAdapter));
  app.useGlobalInterceptors(new GlobalInterceptor());

  await app.init();
}
export const api = functions.https.onRequest(async (request, response) => {
  await bootstrap();
  expressServer(request, response);
});
