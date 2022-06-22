import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { IsNumber } from 'class-validator';

export class UserDto {
  @IsNumber()
  id: number;
  name?: string;
  createdAt: Date;
  avatarSrc?: string;
  updatedAt: Date;
  @ApiProperty({ enum: Role })
  role: Role;
}
