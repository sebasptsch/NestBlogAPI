import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import csurf from 'csurf';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';
import { AppClusterService } from './app-cluster.service';
import swStats from 'swagger-stats';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      cors: {
        origin: [
          'https://blog-frontend-virid.vercel.app',
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
    host: config.get('REDIS_HOST'),
    port: parseInt(config.get('REDIS_PORT')),
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
      transform: true,
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

  app.use(
    swStats.getMiddleware({
      swaggerSpec: document,
    }),
  );

  await app.listen(3000);
}
AppClusterService.clusterize(bootstrap);
