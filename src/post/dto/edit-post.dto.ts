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

export class EditPostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/)
  slug?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsObject()
  @IsOptional()
  content?: object;

  @IsEnum(DraftStatus)
  @IsOptional()
  status?: DraftStatus;
}
