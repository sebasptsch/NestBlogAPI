import {
  isNotEmpty,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Matches(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/)
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsObject()
  @IsNotEmpty()
  content: object;
}
