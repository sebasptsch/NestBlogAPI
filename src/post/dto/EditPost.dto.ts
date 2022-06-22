import {
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { PostDto } from './Post.dto';

export class EditPostDto extends PartialType(
  OmitType(PostDto, [
    'createdAt',
    'id',
    'updatedAt',
    'userId',
  ] as const),
) {}
