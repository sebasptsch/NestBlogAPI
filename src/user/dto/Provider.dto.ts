import { ApiProperty } from '@nestjs/swagger';
import {
  AccountType,
  Provider,
} from '@prisma/client';

export class ProviderDto implements Provider {
  id: number;
  uid: string;
  @ApiProperty({ enum: AccountType })
  provider: AccountType;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}
