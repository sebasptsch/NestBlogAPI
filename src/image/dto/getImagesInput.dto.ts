import { IsNumber } from 'class-validator';

export class GetImagesDto {
  cursor?: number;
  take?: number;
}
