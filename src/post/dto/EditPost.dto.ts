import {
  ApiProperty,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { DraftStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PostDto } from './Post.dto';

export class EditPostDto {
  @IsEnum(DraftStatus)
  @ApiProperty({ enum: DraftStatus })
  @IsOptional()
  status?: DraftStatus;

  @ApiProperty()
  @Matches(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/)
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  summary?: string;

  @IsObject()
  @ApiProperty()
  @IsOptional()
  content?: object;

  @IsDateString()
  @ApiProperty()
  @IsOptional()
  publishedAt?: Date;
}
