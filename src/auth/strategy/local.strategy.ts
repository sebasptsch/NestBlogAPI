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
import { AuthService } from '../auth.service';
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
    if (!user) {
      throw new UnauthorizedException(user);
    }
    return user;
  }
}
