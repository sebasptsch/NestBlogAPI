import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as csurf from 'csurf';
import Redis from 'ioredis';
import * as connectRedis from 'connect-redis';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

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

  let redisClient = new Redis({
    host: 'localhost',
    port: 6380,
  });
  const redisStore = connectRedis(session);

  app.use(
    session({
      secret: config.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      store: new redisStore({
        client: redisClient,
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(csurf());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Seb's Blog API")
    .setDescription(
      'The seb blog API description',
    )
    .addCookieAuth('connect.sid')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );
  // console.log(document);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: "Seb's Blog API Reference",
  });

  await app.listen(3000);
}
bootstrap();
