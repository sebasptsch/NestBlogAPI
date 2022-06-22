import {
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { UserDto } from './User.dto';

export class MinimalUserDto extends PickType(
  UserDto,
  ['name', 'id', 'avatarSrc'] as const,
) {}
