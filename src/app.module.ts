import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ImageModule } from './image/image.module';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './auth/guard/role.guard';
// import { PopulateUserMiddleware } from './auth/middleware';
// import { JwtModule } from '@nestjs/jwt';
import { SitemapService } from './sitemap/sitemap.service';
import { SitemapController } from './sitemap/sitemap.controller';
import { SitemapModule } from './sitemap/sitemap.module';
import { GraphQLModule } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import {
  ApolloDriver,
  ApolloDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    PostModule,
    AuthModule,
    PrismaModule,
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ImageModule,
    SitemapModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(
        process.cwd(),
        'src/schema.graphql',
      ),
      introspection: true,
      driver: ApolloDriver,
      sortSchema: true,
      resolvers: {
        JSON: GraphQLJSON,
      },
    }),
    // JwtModule.register({}),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
