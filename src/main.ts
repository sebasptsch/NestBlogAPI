import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      cors: {
        origin: [
          'http://localhost:3002',
          'https://hoppscotch.io',
        ],
        allowedHeaders:
          'X-Requested-With,Content-Type,authorization',
        credentials: true,
        methods:
          'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
