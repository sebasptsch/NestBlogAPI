import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { SessionSerializer } from './session.serializer.js';
import {
  LocalStrategy,
  GithubStrategy,
  DiscordStrategy,
  JwtStrategy,
} from './strategy/index.js';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    // JwtModule.register({}),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GithubStrategy,
    DiscordStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
