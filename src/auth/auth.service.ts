import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { userInfo } from 'os';
import { Profile as DiscordProfile } from 'passport-discord';
import { Profile as GithubProfile } from 'passport-github2';
import { NotFoundError } from 'rxjs';
import { Profile } from 'passport';
import type Prisma from '@prisma/client';
import { providerInclude } from './contants';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService, // private jwtService: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    // console.log('hello');
    const existingAccount =
      await this.prisma.provider.findFirst({
        where: {
          uid: dto.username,
          provider: 'LOCAL',
        },
      });
    if (existingAccount) {
      throw new BadRequestException(
        'Credentials taken',
      );
    }

    const hash = await argon.hash(dto.password);

    const provider =
      await this.prisma.provider.create({
        data: {
          uid: dto.username,
          provider: 'LOCAL',
          password: hash,
          user: {
            create: {
              name: dto.username,
            },
          },
        },
        include: {
          user: true,
        },
      });
    // return this.signToken(user.id);
    return provider.user;
  }

  async validateDiscordUser(
    user: DiscordProfile,
  ) {
    // console.log(user);
    const existingAccount =
      await this.prisma.provider.findFirst({
        where: {
          uid: user.id,
          provider: 'DISCORD',
        },
        include: {
          user: true,
        },
      });
    if (!existingAccount) {
      const account =
        await this.prisma.provider.create({
          data: {
            uid: user.id,
            provider: 'DISCORD',

            user: {
              create: {
                name: user.username,
                // avatarSrc: `https://cdn.discordapp.com/${user.avatar}.webp`,
              },
            },
          },
          include: {
            user: true,
          },
        });
      return account.user;
    } else {
      return existingAccount.user;
    }
  }

  async validateGithubUser(
    profile: GithubProfile,
  ) {
    // console.log(profile);
    const existingAccount =
      await this.prisma.provider.findFirst({
        where: {
          uid: profile.id,
          provider: 'GITHUB',
        },
        include: {
          user: true,
        },
      });
    if (!existingAccount) {
      const account =
        await this.prisma.provider.create({
          data: {
            uid: profile.id,
            provider: 'GITHUB',
            user: {
              create: {
                name: profile.displayName,
                avatarSrc:
                  profile.photos[0].value, // TODO: Grabs random photo?
              },
            },
          },
          include: {
            user: true,
          },
        });
      return account.user;
    } else {
      return existingAccount.user;
    }
  }

  async validateLocalUser(
    username: string,
    password: string,
  ) {
    if (!username)
      throw new BadRequestException(
        'No username provided',
      );
    if (!password)
      throw new BadRequestException(
        'No password provided',
      );
    const account =
      await this.prisma.provider.findFirst({
        where: {
          uid: username,
          provider: 'LOCAL',
        },
        include: {
          user: true,
        },
      });

    if (!account) {
      throw new NotFoundException(
        "An account with this username doesn't exist.",
      );
    }

    const pwMatches = await argon.verify(
      account.password,
      password,
    );

    if (!pwMatches) {
      throw new BadRequestException(
        'Invalid password',
      );
    }
    return account.user;
  }

  async isAdmin(userId?: number) {
    if (!userId) {
      return { isAdmin: false };
    }
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          role: true,
        },
      });
    if (!user) {
      return { isAdmin: false };
    }
    if (user.role !== 'ADMIN') {
      return { isAdmin: false };
    }
    return { isAdmin: true };
  }
}
