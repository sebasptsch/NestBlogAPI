import {
  Inject,
  forwardRef,
} from '@nestjs/common';
import {
  Resolver,
  Args,
  Int,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import {
  DraftStatus,
  User,
} from '@prisma/client';
import { GQLCurrentUser } from 'src/auth/decorator/current-gql-user.decorator';
import { User as GQLUser } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Express } from 'express';
@Resolver((of) => Post)
export class PostResolver {
  constructor(
    private postsService: PostService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  @Query((returns) => Post)
  async post(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @GQLCurrentUser() user?: User,
  ) {
    return this.postsService.post({
      where: {
        id,
        OR: [
          {
            status: 'PUBLISHED',
          },
          {
            userId: user?.id,
          },
        ],
      },
    });
  }

  @ResolveField()
  async user(@Parent() post: Post) {
    const { userId } = post;
    return this.userService.user({
      where: { id: userId },
    });
  }

  @Query((returns) => [Post])
  async posts(@GQLCurrentUser() user?: User) {
    return this.postsService.posts({
      where: {
        OR: [
          {
            status: 'PUBLISHED',
          },
          {
            userId: user?.id,
          },
        ],
      },
    });
  }
}
