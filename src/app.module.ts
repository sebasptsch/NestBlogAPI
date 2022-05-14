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
import { PopulateUserMiddleware } from './auth/middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PostModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PopulateUserMiddleware)
      .forRoutes('posts')
      .apply(PopulateUserMiddleware)
      .forRoutes('auth/*');
  }
}
