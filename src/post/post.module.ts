import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { PopulateUserMiddleware } from '../auth/middleware';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
