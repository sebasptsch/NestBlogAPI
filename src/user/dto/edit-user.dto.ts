import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  name?: string;
}
