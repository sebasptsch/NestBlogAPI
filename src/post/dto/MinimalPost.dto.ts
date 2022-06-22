import { OmitType } from '@nestjs/swagger';
import { PostDto } from './Post.dto';

export class MinimalPostDto extends OmitType(
  PostDto,
  ['content'] as const,
) {}
