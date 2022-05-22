import {
  IsDate,
  IsDateString,
  isNotEmpty,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  // @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  title: string;

  // @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  summary: string;

  // @ApiProperty({ required: false })
  @IsObject()
  @IsNotEmpty()
  content: object;
}
