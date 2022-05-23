import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { userInclude } from '../auth/contants.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EditUserDto } from './dto/index.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(
    userId: number,
    dto: EditUserDto,
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name ?? undefined,
        avatarSrc: dto.avatarSrc ?? undefined,
      },
    });
    return user;
  }

  async getUser(userId) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        id: true,
        avatarSrc: true,
      },
    });
  }

  async getPrivateUser(userId) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      ...userInclude,
    });
  }

  async deleteUser(userId) {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
      include: {
        posts: true,
        images: true,
      },
    });
  }
}
