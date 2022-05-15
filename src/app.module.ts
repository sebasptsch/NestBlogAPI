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

@Module({
  imports: [
    UserModule,
    PostModule,
    AuthModule,
    PrismaModule,
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
