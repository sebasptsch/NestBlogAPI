import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

export class UserDto implements User {
  id: number;
  name: string | null;
  createdAt: Date;
  avatarSrc: string | null;
  updatedAt: Date;
  @ApiProperty({ enum: Role })
  role: Role;
}
