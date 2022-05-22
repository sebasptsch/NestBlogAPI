import { PartialType } from '@nestjs/swagger';
import { DraftStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { ApiProperty } from '@nestjs/swagger';

enum Status {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class EditPostDto extends PartialType(
  CreatePostDto,
) {
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @Matches(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/)
  @IsString()
  @IsOptional()
  slug?: string;

  @IsDateString()
  @IsOptional()
  publishedAt?: string;
}
