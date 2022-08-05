import { ApiProperty } from '@nestjs/swagger';
import {
  DraftStatus,
  Post,
  Prisma,
} from '@prisma/client';
import {
  IsDateString,
  IsNumber,
  IsNumberString,
  IsObject,
  IsString,
  Matches,
} from 'class-validator';

export class PostDto {
  id: number;
  @ApiProperty({ enum: DraftStatus })
  status: DraftStatus;
  @Matches(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/)
  slug: string;
  @IsString()
  title: string;
  @IsString()
  summary: string;
  @IsObject()
  content: object;

  userId: number;
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  publishedAt: Date;
  @IsDateString()
  updatedAt: Date;
  bannerSrc?: string;
}
