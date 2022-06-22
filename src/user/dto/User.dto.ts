import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

export class UserDto {
  id: number;
  name?: string;
  createdAt: Date;
  avatarSrc?: string;
  updatedAt: Date;
  @ApiProperty({ enum: Role })
  role: Role;
}
