import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import GlobalExceptionHandler from './modules/global/global.exception';
import { GlobalInterceptor } from './modules/global/global.interceptor';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import 'reflect-metadata';
import { VercelRequest, VercelResponse } from '@vercel/node';

let nestServer;

async function bootstrap() {
  const expressServer = express();
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
  return httpAdapter.httpAdapter.getInstance();
}
// export const api = functions.https.onRequest(async (request, response) => {
//   await bootstrap();
//   expressServer(request, response);
// });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!nestServer) nestServer = await bootstrap(); //not handling error as it should fail if app not starting

  nestServer(req, res);
}
