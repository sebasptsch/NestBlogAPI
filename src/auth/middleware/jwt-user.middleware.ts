import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request } from 'express';

@Injectable()
export class PopulateUserMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      const jwt = authHeader.split(' ')[1];
      const payload =
        await this.jwtService.verify(jwt, {
          secret:
            this.configService.get('JWT_SECRET'),
        });
      req.user = payload;
      next();
    }
  }
}
