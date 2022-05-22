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
import { PrismaService } from 'src/prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import ImageFileInterceptor from './interceptors/image.interceptor';
// import { SessionGuard } from 'src/auth/guard';
import { ImageService } from './image.service';
import { GetUser } from 'src/auth/decorator';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { SharpPipe } from './pipes/processImage.pipe';
import { SessionGuard } from 'src/auth/guard';
import { LocalFileDto } from './dto/create.dto';
import { ApiConsumes } from '@nestjs/swagger';
import {
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import {
  fileTypeFromBuffer,
  fileTypeFromFile,
} from 'file-type';

@ApiTags('Images')
@Controller('images')
export class ImageController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly images: ImageService,
  ) {}

  /** Upload a new image */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiConsumes('multipart/form-data')
  @Post()
  @Roles('ADMIN')
  @UseInterceptors(
    ImageFileInterceptor({
      fieldName: 'file',
      path: '/images',
      limits: {
        fileSize: Math.pow(1024, 2), // 1MB
      },
      fileFilter: async (
        request,
        file,
        callback,
      ) => {
        const fileType = await fileTypeFromBuffer(
          file.buffer,
        );
        if (
          !file.mimetype.includes('image') ||
          !fileType.mime.includes('image')
        ) {
          return callback(
            new BadRequestException(
              'Please provid a valid image',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async addImage(
    @UploadedFile(SharpPipe)
    image: { filename: string; path: string },
    @GetUser('id') id: number,
    @Body() body: LocalFileDto,
  ) {
    return this.images.uploadImage(
      {
        userId: id,
        path: image.path,
        filename: image.filename,
        mimetype: 'image/webp',
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
          id: id,
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
  async getBelongingImages(
    @GetUser('id') userId: number,
  ) {
    return this.images.getBelongingImages(userId);
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
    return this.images.deleteImage(id, userId);
  }
}
