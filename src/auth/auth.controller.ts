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
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import passport from 'passport';
import { AuthService } from './auth.service.js';
import { AuthDto } from './dto/index.js';
import {
  DiscordAuthGuard,
  GithubAuthGuard,
  LocalAuthGuard,
  SessionGuard,
} from './guard/index.js';
import { RecaptchaGuard } from './guard/recaptcha.guard.js';
import { Image } from '@prisma/client';
import {
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { GetUser } from './decorator/index.js';
import { LoggedInDto } from './dto/loggedin.dto.js';
import { UserDto } from './dto/User.dto.js';
import { IsAdminDto } from './dto/isAdmin.dto.js';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** Log out of the logged in account */
  @UseGuards(SessionGuard)
  @ApiResponse({ status: 201 })
  @ApiOperation({ operationId: 'logout' })
  @ApiCookieAuth()
  @Post('logout')
  async logout(@Req() request: Request) {
    request.session.destroy(() => {});
  }

  /** Sign up to a new local account */
  @ApiCreatedResponse({
    description: 'Successfully created user',
  })
  @ApiOperation({ operationId: 'register' })
  @ApiBadRequestResponse({
    description: 'Credentials taken',
  })
  @ApiOkResponse({ type: UserDto })
  // @UseGuards(RecaptchaGuard)
  @Post('register')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  /** Sign in to an existing local account */
  @UseGuards(LocalAuthGuard, RecaptchaGuard)
  @ApiOperation({ operationId: 'signin' })
  @Post('signin')
  async signin(@Body() dto: AuthDto) {}

  // @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @ApiOkResponse({ type: LoggedInDto })
  @ApiOperation({ operationId: 'loggedIn' })
  @Get('loggedIn')
  async loggedIn(@Req() req) {
    return { loggedIn: !!req.user };
  }

  @Get('isAdmin')
  @ApiOkResponse({ type: IsAdminDto })
  @ApiOperation({ operationId: 'isAdmin' })
  @ApiCookieAuth()
  async isAdmin(
    @Req() req,
    @GetUser('id') userId?: number,
  ) {
    return this.authService.isAdmin(userId);
  }

  /** Sign in using github */
  @UseGuards(GithubAuthGuard)
  @Get('github')
  @ApiOperation({ operationId: 'githubSignIn' })
  githubSignIn() {}

  /** Sign in using github (callback) */
  @Redirect('https://www.sebasptsch.dev/profile')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({
    operationId: 'githubSignInCallback',
  })
  @Get('github/callback')
  async githubSignInCallback() {
    // return '<script>window.close();</script >';
  }

  /** Sign in using discord */
  @UseGuards(DiscordAuthGuard)
  @ApiOperation({ operationId: 'discordSignIn' })
  @Get('discord')
  discordSignIn() {}

  /** Sign in using discord (callback) */
  @Redirect('https://www.sebasptsch.dev/profile')
  @UseGuards(DiscordAuthGuard)
  @ApiOperation({
    operationId: 'discordSignInCallback',
  })
  @Get('discord/callback')
  async discordSignInCallback(
    @Req() req: Request,
  ) {}
}
