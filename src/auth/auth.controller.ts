import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
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
  ) {
    request.session.destroy(() => {});
  }

  // @UseGuards(RecaptchaGuard)
  @Post('register')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  // @Redirect('http://localhost:3002/users/me')
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin() {}

  @UseGuards(GithubAuthGuard)
  @Get('github')
  githubSignIn() {}

  @Redirect('http://localhost:3002/users/me')
  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  async githubSignInCallback() {}

  @UseGuards(DiscordAuthGuard)
  @Get('discord')
  discordSignIn() {}

  @Redirect('http://localhost:3002/users/me')
  @UseGuards(DiscordAuthGuard)
  @Get('discord/callback')
  async discordSignInCallback() {}
}
