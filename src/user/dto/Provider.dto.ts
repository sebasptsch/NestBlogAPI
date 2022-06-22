import { ApiProperty } from '@nestjs/swagger';
import {
  AccountType,
  Provider,
} from '@prisma/client';

export class ProviderDto {
  id: number;
  uid: string;
  @ApiProperty({ enum: AccountType })
  provider: AccountType;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}
