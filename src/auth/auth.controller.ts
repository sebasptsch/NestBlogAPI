import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import passport from 'passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import {
  DiscordAuthGuard,
  GithubAuthGuard,
  LocalAuthGuard,
} from './guard';
import { RecaptchaGuard } from './guard/recaptcha.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('logout')
  async logout(
    @Req()
    request: Request,
    @Res()
    response: Response,
  ) {
    request.session.destroy(() => {});
  }

  @UseGuards(RecaptchaGuard)
  @Post('register')
  async signup(
    @Body() dto: AuthDto,
    @Res()
    response: Response,
  ) {
    return this.authService.signup(dto);
  }

  @UseGuards(RecaptchaGuard, LocalAuthGuard)
  @Post('signin')
  async signin(
    @Req() req,
    @Res()
    response: Response,
  ) {
    response.redirect(
      'http://localhost:3002/users/me',
    );
  }

  @UseGuards(GithubAuthGuard)
  @Get('github')
  githubSignIn(@Req() req) {}

  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  async githubSignInCallback(
    @Req() req,
    @Res()
    response: Response,
  ) {
    response.redirect(
      'http://localhost:3002/users/me',
    );
  }

  @UseGuards(DiscordAuthGuard)
  @Get('discord')
  discordSignIn(@Req() req) {}

  @UseGuards(DiscordAuthGuard)
  @Get('discord/callback')
  async discordSignInCallback(
    @Req() req,
    @Res()
    response: Response,
  ) {
    response.redirect(
      'http://localhost:3002/users/me',
    );
  }
}
