import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PopulateUserMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      next();
    } else {
      try {
        const jwt = authHeader.split(' ')[1];
        const payload =
          await this.jwtService.verify(jwt, {
            secret:
              this.configService.get(
                'JWT_SECRET',
              ),
          });
        if (payload?.sub) {
          req.user =
            await this.prisma.user.findUnique({
              where: {
                id: payload.sub,
              },
            });
        }
        // req.user = payload;
        next();
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException(
            'Your access has expired please login again.',
          );
        }
      }
    }
  }
}
