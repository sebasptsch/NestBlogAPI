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
import {
  ApiResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import passport from 'passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import {
  DiscordAuthGuard,
  GithubAuthGuard,
  LocalAuthGuard,
  SessionGuard,
} from './guard';
import { RecaptchaGuard } from './guard/recaptcha.guard';
import { Image } from '@prisma/client';
import {
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { GetUser } from './decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** Log out of the logged in account */
  @UseGuards(SessionGuard)
  @ApiResponse({ status: 201 })
  @Post('logout')
  async logout(@Req() request: Request) {
    request.session.destroy(() => {});
  }

  /** Sign up to a new local account */
  @ApiCreatedResponse({
    description: 'Successfully created user',
  })
  @ApiBadRequestResponse({
    description: 'Credentials taken',
  })
  @Post('register')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  /** Sign in to an existing local account */
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Body() dto: AuthDto) {}

  // @UseGuards(SessionGuard)
  @Get('loggedIn')
  async loggedIn(@Req() req) {
    return { loggedIn: !!req.user };
  }

  @Get('isAdmin')
  async isAdmin(
    @Req() req,
    @GetUser('id') userId?: number,
  ) {
    return this.authService.isAdmin(userId);
  }

  /** Sign in using github */
  @UseGuards(GithubAuthGuard)
  @Get('github')
  githubSignIn() {}

  /** Sign in using github (callback) */
  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  async githubSignInCallback() {
    return '<script>window.close();</script >';
  }

  /** Sign in using discord */
  @UseGuards(DiscordAuthGuard)
  @Get('discord')
  discordSignIn() {}

  /** Sign in using discord (callback) */
  @UseGuards(DiscordAuthGuard)
  @Get('discord/callback')
  async discordSignInCallback() {
    return '<script>window.close();</script >';
  }
}
