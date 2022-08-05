import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import path from 'path';
import sharp from 'sharp';

@Injectable()
export class SharpPipe
  implements
    PipeTransform<
      Express.Multer.File,
      Promise<{ filename: string; path: string }>
    >
{
  async transform(
    image: Express.Multer.File,
  ): Promise<{ filename: string; path: string }> {
    const { fileTypeFromBuffer } = await import(
      'file-type'
    );
    const fileType = await fileTypeFromBuffer(
      Buffer.from(image.buffer),
    );
    if (!fileType?.mime.includes('image')) {
      throw new BadRequestException(
        'Please provid a valid image',
      );
    }
    const originalName = path.parse(
      image.originalname,
    ).name;
    const filename =
      Date.now() + '-' + originalName + '.webp';

    await sharp(image.buffer)
      .resize(800)
      .webp({ effort: 3 })
      .toFile(path.join('images', filename));

    return {
      filename,
      path: path.join('images', filename),
    };
  }
}
