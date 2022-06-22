import { Image } from '@prisma/client';
import {
  IsNumber,
  IsNumberString,
} from 'class-validator';

export class ImageDto implements Image {
  id: number;
  filename: string;
  path: string;
  name: string;
  @IsNumber()
  userId: number;
}
