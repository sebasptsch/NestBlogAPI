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
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { Post } from './post.model';
import { PostService } from './post.service';

@Resolver((of) => Post)
export class PostResolver {
  constructor(
    private postsService: PostService,
    // private userService: UserService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  @Query((returns) => Post)
  async post(
    @Args('id', {
      type: () => Int,
      //   nullable: true,
    })
    id: number,
    // @Args('slug', {
    //   type: () => String,
    //   nullable: true,
    // })
    // slug?: string,
  ) {
    return this.postsService.post({
      where: {
        id,
        status: 'PUBLISHED',
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
  async posts() {
    return this.postsService.posts({
      where: {
        status: 'PUBLISHED',
      },
    });
  }
}
