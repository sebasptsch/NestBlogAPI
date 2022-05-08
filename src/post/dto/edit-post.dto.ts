import { PartialType } from '@nestjs/mapped-types';
import { DraftStatus } from '@prisma/client';
import {
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { CreatePostDto } from './create-post';

export class EditPostDto extends PartialType(
  CreatePostDto,
) {
  @IsEnum(DraftStatus)
  @IsOptional()
  status?: DraftStatus;

  @Matches(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/)
  @IsString()
  @IsOptional()
  slug?: string;
}
