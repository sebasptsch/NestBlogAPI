import {
  ApiProperty,
  IntersectionType,
} from '@nestjs/swagger';
import {
  DraftStatus,
  Post,
  Prisma,
} from '@prisma/client';
import { IsNumber } from 'class-validator';
import { PostDto } from './Post.dto';

class AdditionalUserInfo {
  user: {
    id: number;
    name: string;
  };
}

export class GetPostWithUserDto extends IntersectionType(
  PostDto,
  AdditionalUserInfo,
) {}
