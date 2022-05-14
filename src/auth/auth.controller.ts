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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('logout')
  async logout(
    @Res({ passthrough: true })
    response: Response,
  ) {
    response.cookie('token', '', {
      expires: new Date(),
    });
  }

  @Post('register')
  async signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    response.cookie(
      'token',
      (await this.authService.signup(dto))
        .access_token,
      {
        expires: new Date(
          new Date().getTime() + 1000 * 900,
        ),
        sameSite: 'strict',
        domain: 'localhost',
      },
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(
    @Req() req,
    @Res({ passthrough: true })
    response: Response,
  ) {
    // return this.authService.signin(req.user);
    response.cookie(
      'token',
      (await this.authService.signin(req.user))
        .access_token,
      {
        expires: new Date(
          new Date().getTime() + 1000 * 900,
        ),
        sameSite: 'strict',
        domain: 'localhost',
      },
    );
  }

  @UseGuards(GithubAuthGuard)
  @Get('github')
  githubSignIn(@Req() req) {}

  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  async githubSignInCallback(
    @Req() req,
    @Res({ passthrough: true })
    response: Response,
  ) {
    // return this.authService.signin(req.user);
    response.cookie(
      'token',
      (await this.authService.signin(req.user))
        .access_token,
      {
        expires: new Date(
          new Date().getTime() + 1000 * 900,
        ),
        sameSite: 'strict',
        domain: 'localhost',
      },
    );
  }

  @UseGuards(DiscordAuthGuard)
  @Get('discord')
  discordSignIn(@Req() req) {}

  @UseGuards(DiscordAuthGuard)
  @Get('discord/callback')
  async discordSignInCallback(
    @Req() req,
    @Res({ passthrough: true })
    response: Response,
  ) {
    // return this.authService.signin(req.user);
    response.cookie(
      'token',
      (await this.authService.signin(req.user))
        .access_token,
      {
        expires: new Date(
          new Date().getTime() + 1000 * 900,
        ),
        sameSite: 'strict',
        domain: 'localhost',
      },
    );
  }
}
