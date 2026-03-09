/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isDev = process.env.NODE_ENV !== 'production';
  app.enableCors({
    origin: isDev
      ? /^http:\/\/localhost(:\d+)?$/
      : process.env.WEB_APP_URL,
    credentials: true,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
