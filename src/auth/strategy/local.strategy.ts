import {
  IStrategyOptionsWithRequest,
  Strategy,
} from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service.js';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(private authService: AuthService) {
    const config: IStrategyOptionsWithRequest = {
      passReqToCallback: true,
    };
    super(config);
  }

  async validate(
    req: Request,
    username: string,
    password: string,
  ): Promise<any> {
    const user =
      await this.authService.validateLocalUser(
        username,
        password,
      );

    return user;
  }
}
