import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  LocalStrategy,
  GithubStrategy,
  DiscordStrategy,
  JwtStrategy,
} from './strategy';

@Module({
  imports: [
    PassportModule.register({
      successRedirect:
        'http://localhost:3002/users/me',
      failureRedirect:
        'http://localhost:3002/auth/signin',
    }),
    JwtModule.register({}),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GithubStrategy,
    DiscordStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
