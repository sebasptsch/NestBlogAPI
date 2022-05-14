import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    // generate the passowrd hash
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          password: hash,
        },
      });
      return this.signToken(
        user.id,
        user.username,
      );
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new UnauthorizedException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }

  async signin(user: {
    username: string;
    id: number;
  }) {
    return this.signToken(user.id, user.username);
  }

  async signToken(
    userId: number,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      username,
    };

    const secret = this.config.get('JWT_SECRET');
    const access_token = await this.jwt.signAsync(
      payload,
      { secret, expiresIn: '15m' },
    );
    return { access_token };
  }

  async validateLocalUser(
    username: string,
    password: string,
  ) {
    // console.log({ email, password });
    const user =
      await this.prisma.user.findUnique({
        where: {
          username,
        },
      });
    if (!user) {
      return null;
    }

    const pwMatches = await argon.verify(
      user.password,
      password,
    );

    if (pwMatches) {
      delete user.password;
      return user;
    }
    return null;
  }
}
