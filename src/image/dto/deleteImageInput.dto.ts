import { IsNumber } from 'class-validator';

export class DeleteImageDto {
  @IsNumber()
  id: number;
}
