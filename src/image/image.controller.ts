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
  Query,
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
import { LocalFileDto } from './dto/createImageInput.dto.js';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { GetImagesDto } from './dto/getImagesInput.dto.js';
import { GetImageDto } from './dto/getImageInput.dto.js';
import { DeleteImageDto } from './dto/deleteImageInput.dto.js';
import { ImageDto } from 'src/image/dto/Image.dto';

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
  @ApiCreatedResponse({
    type: ImageDto,
  })
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
  @ApiOkResponse({
    description: 'Returns the image file itself',
  })
  async getImage(
    @Param('id', ParseIntPipe)
    id: number,
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
  @ApiOkResponse({ type: [ImageDto] })
  @Get()
  async getImages(
    @GetUser('id') userId: number,
    @Query() queryParams: GetImagesDto,
  ) {
    const { cursor, take } = queryParams;

    return this.imageService.images({
      where: {
        userId,
      },
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      take,
    });
  }

  /** Delete an image by it's id */
  @ApiCookieAuth()
  @Roles('ADMIN')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: ImageDto })
  @Delete(':id')
  async deleteImage(
    @Param() { id }: DeleteImageDto,
    @GetUser('id') userId: number,
  ) {
    return this.imageService.deleteImage(
      id,
      userId,
    );
  }
}
