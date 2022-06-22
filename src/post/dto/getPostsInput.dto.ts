import { IsNumber } from 'class-validator';

export class GetPostsDto {
  cursor?: number;
  take?: number;
}
