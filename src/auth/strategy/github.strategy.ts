import {
  Profile,
  Strategy,
  StrategyOptions,
  StrategyOptionsWithRequest,
} from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service.js';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class GithubStrategy extends PassportStrategy(
  Strategy,
  'github',
) {
  constructor(
    private authService: AuthService,
    config: ConfigService,
  ) {
    const options: StrategyOptionsWithRequest = {
      passReqToCallback: true,
      clientID: config.get('GITHUB_CLIENT_ID'),
      clientSecret: config.get('GITHUB_SECRET'),
      callbackURL: config.get('GITHUB_CALLBACK'),
      scope: ['read:user'],
    };
    super(options);
  }

  async validate(
    req,
    accessToken,
    refreshToken,
    profile: Profile,
    done,
  ): Promise<any> {
    const user =
      await this.authService.validateGithubUser(
        profile,
      );
    if (!user) {
      throw new UnauthorizedException(user);
    }
    return user;
  }
}
