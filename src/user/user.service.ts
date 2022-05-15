import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(
    userId: number,
    dto: EditUserDto,
  ) {
    if (dto.avatarId) {
      const avatarImage =
        await this.prisma.image.findFirst({
          where: {
            id: dto.avatarId,
            userId,
          },
        });
      if (!avatarImage)
        throw new ForbiddenException(
          'No image found.',
        );
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: dto.name ?? undefined,
          avatar: {
            connect: {
              id: avatarImage.id,
            },
          },
        },
      });
      return user;
    } else {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: dto.name ?? undefined,
        },
      });
      return user;
    }
  }

  async getUser(userId) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        avatar: true,
        accounts: true,
      },
    });
  }
}
