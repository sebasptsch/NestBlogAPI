import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async uploadImage(data: LocalFileDto) {
    return this.prisma.image.create({
      data: {
        filename: data.filename,
        path: data.path,
        mimetype: data.mimetype,
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
    } else {
      throw new ForbiddenException(
        'This is not your image to delete.',
      );
    }
  }

  getBelongingImages(userId: number) {
    return this.prisma.image.findMany({
      where: {
        userId,
      },
    });
  }
}
