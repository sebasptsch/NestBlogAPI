import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { PrismaService } from '../prisma/prisma.service.js';
import * as fs from 'fs';
import { LocalFileDto } from './dto/createImageInput.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async uploadImage(data, name) {
    return this.prisma.image.create({
      data: {
        filename: data.filename,
        name,
        path: data.path,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
  }

  async deleteImage(id: number, userId: number) {
    const image = this.prisma.image.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (image) {
      const deletedImage =
        await this.prisma.image.delete({
          where: {
            id,
          },
        });
      fs.unlink(deletedImage.path, (err) => {
        if (err) {
          throw new InternalServerErrorException(
            'Unable to delete image',
          );
        } else {
          return deletedImage;
        }
      });
      return deletedImage;
    } else {
      throw new ForbiddenException(
        'This is not your image to delete.',
      );
    }
  }

  async images(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ImageWhereUniqueInput;
    where?: Prisma.ImageWhereInput;
    orderBy?: Prisma.ImageOrderByWithRelationInput;
    select?: Prisma.ImageSelect;
  }) {
    const {
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    } = params;
    return this.prisma.image.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }
}
