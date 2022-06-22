import { ApiProperty } from '@nestjs/swagger';
import {
  DraftStatus,
  Post,
  Prisma,
} from '@prisma/client';
import {
  IsDateString,
  Matches,
} from 'class-validator';

export class PostDto implements Post {
  id: number;
  @ApiProperty({ enum: DraftStatus })
  status: DraftStatus;
  @Matches(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/)
  slug: string;
  title: string;
  summary: string;
  content: Prisma.JsonValue;
  userId: number;
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  publishedAt: Date;
  @IsDateString()
  updatedAt: Date;
  bannerSrc: string | null;
}
