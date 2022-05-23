import { Module } from '@nestjs/common';
import { ImageController } from './image.controller.js';
import { ImageService } from './image.service.js';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
