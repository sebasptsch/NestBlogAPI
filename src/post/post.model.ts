import {
  Field,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import GraphQLJSON from 'graphql-type-json';
// import { Post } from './post';

import Prisma from '@prisma/client';

enum Status {
  'DRAFT' = 'DRAFT',
  'PUBLISHED' = 'PUBLISHED',
}

registerEnumType(Status, {
  name: 'Status',
});

@ObjectType()
export class Post {
  @Field((type) => Int)
  id: number;

  @Field((type) => String)
  title: string;

  @Field((type) => Status)
  status: Status;

  @Field((type) => GraphQLJSON)
  content: object;

  @Field((type) => String)
  slug: string;

  @Field((type) => String)
  summary: string;

  @Field((type) => Date)
  publishedAt: Date;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;

  @Field((type) => User)
  user: User;

  @Field((type) => Int)
  userId: number;
}
