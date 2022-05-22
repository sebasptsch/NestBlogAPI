import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
