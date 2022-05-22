import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  avatarSrc?: string;
}
