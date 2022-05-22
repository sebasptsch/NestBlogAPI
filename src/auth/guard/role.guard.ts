import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const role = this.reflector.get<Role>(
      'role',
      context.getHandler(),
    );
    if (!role) {
      return true;
    }
    const request = context
      .switchToHttp()
      .getRequest();
    const userId = request.user.id;
    const { role: userRole } =
      await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
    if (role !== userRole) {
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      );
    }
    return true;
  }
}
