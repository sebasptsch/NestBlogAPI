import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import {
  LocalStrategy,
  GithubStrategy,
  DiscordStrategy,
} from './strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
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
