import {
  forwardRef,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  Resolver,
  Args,
  Int,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import { GQLCurrentUser } from 'src/auth/decorator/current-gql-user.decorator';
import { GQLSessionGuard } from 'src/auth/guard/gql-session.guard';
import { PostService } from 'src/post/post.service';
//   import { UserService } from 'src/user/user.service';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => PostService))
    private postsService: PostService,
  ) {}

  @Query((returns) => User)
  async user(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return this.userService.user({ id });
  }

  @Query((returns) => User)
  @UseGuards(GQLSessionGuard)
  whoAmI(@GQLCurrentUser() user: User) {
    return this.userService.user({ id: user.id });
  }

  //   @ResolveField()
  //   async posts(@Parent() author: Author) {
  //     const { id } = author;
  //     return this.postsService.findAll({ authorId: id });
  //   }
  @ResolveField()
  async posts(@Parent() user: User) {
    const { id } = user;
    return this.postsService.posts({
      where: {
        userId: id,
        status: 'PUBLISHED',
      },
    });
  }
}
