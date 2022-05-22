import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import type fs from 'fs';
import { ApiProperty } from '@nestjs/swagger';

export class LocalFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
  @IsNotEmpty()
  @IsString()
  name: string;
}
