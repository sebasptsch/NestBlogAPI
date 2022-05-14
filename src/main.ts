import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      cors: {
        origin: 'http://localhost:3002',
        allowedHeaders:
          'X-Requested-With,content-type',
        credentials: true,
        methods:
          'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      },
    },
  );
  app.use(cookieParser('testSecret'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
