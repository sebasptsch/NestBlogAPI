import { Image } from '@prisma/client';

export class ImageDto implements Image {
  id: number;
  filename: string;
  path: string;
  name: string;
  userId: number;
}
