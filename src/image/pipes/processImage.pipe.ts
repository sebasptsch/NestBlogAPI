import {
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';

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
