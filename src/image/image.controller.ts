import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  diskStorage,
  memoryStorage,
} from 'multer';
import ImageFileInterceptor from './interceptors/image.interceptor.js';
// import { SessionGuard } from '../auth/guard';
import { ImageService } from './image.service.js';
import { GetUser } from '../auth/decorator/index.js';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { SharpPipe } from './pipes/processImage.pipe.js';
import { SessionGuard } from '../auth/guard/index.js';
import { LocalFileDto } from './dto/create.dto.js';
import { ApiConsumes } from '@nestjs/swagger';
import {
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator.js';

@ApiTags('Images')
@Controller('images')
export class ImageController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
  ) {}

  /** Upload a new image */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiConsumes('multipart/form-data')
  @Post()
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: Math.pow(1024, 2), // 1MB
      },
    }),
  )
  async addImage(
    @UploadedFile(SharpPipe)
    image: { filename: string; path: string },
    @GetUser('id') id: number,
    @Body() body: LocalFileDto,
  ) {
    return this.imageService.uploadImage(
      {
        userId: id,
        path: image.path,
        filename: image.filename,
      },
      body.name,
    );
  }

  /** Get an image by it's id */
  @Get(':id')
  async getImage(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const fileData =
      await this.prisma.image.findUnique({
        where: {
          id,
        },
      });
    if (!fileData)
      throw new NotFoundException(
        'No image exists with this id.',
      );
    const file = createReadStream(fileData.path);
    file.pipe(res);
  }

  /** Get a list of images that you've uploaded */
  @ApiCookieAuth()
  @Roles('ADMIN')
  @UseGuards(SessionGuard)
  @Get()
  async getImages(
    @GetUser('id') userId: number,
    @Param('cursor') cursorParam?: string,
    @Param('take') takeParam?: string,
  ) {
    const cursor = cursorParam
      ? {
          id: parseInt(cursorParam),
        }
      : undefined;
    const take = takeParam
      ? parseInt(takeParam)
      : undefined;
    return this.imageService.images({
      where: {
        userId,
      },
      cursor,
      take,
    });
  }

  /** Delete an image by it's id */
  @ApiCookieAuth()
  @Roles('ADMIN')
  @UseGuards(SessionGuard)
  @Delete(':id')
  async deleteImage(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    return this.imageService.deleteImage(
      id,
      userId,
    );
  }
}
