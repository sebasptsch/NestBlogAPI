import {
  Field,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Post } from 'src/post/post.model';
// import { Post } from './post';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field((type) => String)
  name: string;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;

  // @Field(type)

  @Field((type) => [Post])
  posts: Post[];
}
