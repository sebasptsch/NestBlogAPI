import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  username?: string;
  @IsString()
  @IsOptional()
  name?: string;
}
