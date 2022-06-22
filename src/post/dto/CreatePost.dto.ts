import {
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { PostDto } from './Post.dto';

export class CreatePostDto extends OmitType(
  PostDto,
  [
    'createdAt',
    'updatedAt',
    'userId',
    'id',
    'status',
  ] as const,
) {}
