import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class GetImageDto {
  // @IsNotEmpty()
  @IsNumber()
  id: number;
}
