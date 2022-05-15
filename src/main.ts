import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      cors: {
        origin: 'http://localhost:3002',
        allowedHeaders:
          'X-Requested-With,Content-Type',
        credentials: true,
        methods:
          'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      },
    },
  );
  const config = app.get(ConfigService);
  app.use(
    cookieParser(config.get('COOKIE_SECRET')),
  );
  app.use(
    session({
      secret: config.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
