import {
  ForbiddenException,
  Injectable,
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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signup(
    dto: AuthDto,
    existingUser?: {
      id: number;
    },
  ) {
    // console.log('hello');
    const existingAccount =
      await this.prisma.provider.findFirst({
        where: {
          uid: dto.username,
          provider: 'LOCAL',
        },
      });
    if (existingAccount) {
      throw new UnauthorizedException(
        'Credentials taken',
      );
    }

    const hash = await argon.hash(dto.password);
    if (existingUser?.id) {
      const provider =
        await this.prisma.provider.create({
          data: {
            uid: dto.username,
            provider: 'LOCAL',
            password: hash,
            user: {
              connect: {
                id: existingUser.id,
              },
            },
          },
          include: {
            user: true,
          },
        });
      // return this.signToken(user.id);
      return provider.user;
    } else {
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
  }

  async validateDiscordUser(
    user: DiscordProfile,
    existingUserId?: number,
  ) {
    const existingAccount =
      await this.prisma.provider.findFirst({
        where: {
          uid: user.id,
          provider: 'DISCORD',
        },
        include: {
          user: {
            include: {
              avatar: true,
            },
          },
        },
      });
    if (!existingAccount) {
      if (existingUserId) {
        const account =
          await this.prisma.provider.create({
            data: {
              uid: user.id,
              provider: 'DISCORD',

              user: {
                connect: {
                  id: existingUserId,
                },
              },
            },
            include: {
              user: {
                include: {
                  avatar: true,
                },
              },
            },
          });
        return account.user;
      } else {
        const account =
          await this.prisma.provider.create({
            data: {
              uid: user.id,
              provider: 'DISCORD',

              user: {
                create: {
                  name: user.username,
                },
              },
            },
            include: {
              user: {
                include: {
                  avatar: true,
                },
              },
            },
          });
        return account.user;
      }
    } else {
      return existingAccount.user;
    }
  }

  async validateGithubUser(
    profile: GithubProfile,
    existingUserId?: number,
  ) {
    const existingAccount =
      await this.prisma.provider.findFirst({
        where: {
          uid: profile.id,
          provider: 'GITHUB',
        },
        include: {
          user: {
            include: {
              avatar: true,
            },
          },
        },
      });
    if (!existingAccount) {
      if (existingUserId) {
        const account =
          await this.prisma.provider.create({
            data: {
              uid: profile.id,
              provider: 'GITHUB',
              user: {
                connect: {
                  id: existingUserId,
                },
              },
            },
            include: {
              user: {
                include: {
                  avatar: true,
                },
              },
            },
          });
        return account.user;
      } else {
        const account =
          await this.prisma.provider.create({
            data: {
              uid: profile.id,
              provider: 'GITHUB',
              user: {
                create: {
                  name: profile.displayName,
                },
              },
            },
            include: {
              user: {
                include: {
                  avatar: true,
                },
              },
            },
          });
        return account.user;
      }
    } else {
      return existingAccount.user;
    }
  }

  async validateLocalUser(
    username: string,
    password: string,
  ) {
    const account =
      await this.prisma.provider.findFirst({
        where: {
          uid: username,
          provider: 'LOCAL',
        },
        include: {
          user: {
            include: {
              avatar: true,
            },
          },
        },
      });

    if (!account) {
      return null;
    }

    const pwMatches = await argon.verify(
      account.password,
      password,
    );

    if (pwMatches) {
      return account.user;
    }
    return null;
  }

  async login(user: any) {
    // console.log('test1');
    const payload = {
      username: user.name,
      sub: user.id,
    };
    // console.log(payload);
    const response = {
      access_token:
        await this.jwtService.signAsync(payload, {
          secret: this.config.get('JWT_SECRET'),
          expiresIn: '15m',
        }),
    };
    // console.log(response);
    return response;
  }
}
