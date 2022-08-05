import {
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import {
  IsDateString,
  IsObject,
  IsString,
  Matches,
} from 'class-validator';
import { PostDto } from './Post.dto';

export class CreatePostDto {
  @Matches(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/)
  slug: string;
  @IsString()
  title: string;
  @IsString()
  summary: string;
  @IsObject()
  content: object;
  @IsDateString()
  createdAt: Date;
}
