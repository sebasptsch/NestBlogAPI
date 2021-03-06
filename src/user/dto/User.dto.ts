import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import {
  IsNumber,
  IsNumberString,
} from 'class-validator';

export class UserDto {
  id: number;
  name?: string;
  createdAt: Date;
  avatarSrc?: string;
  updatedAt: Date;
  @ApiProperty({ enum: Role })
  role: Role;
}
