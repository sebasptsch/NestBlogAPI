import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../auth/guard/optionalJwt.guard';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {
  CreatePostDto,
  EditPostDto,
} from './dto';
import { PostService } from './post.service';
import { Request } from 'express';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  // get all posts
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getPosts(@GetUser('id') userId: number) {
    return this.postService.getPosts(userId);
  }

  // create post
  @UseGuards(JwtGuard)
  @Post()
  createPost(
    @GetUser('id') userId: number,
    @Body() dto: CreatePostDto,
  ) {
    return this.postService.createPost(
      userId,
      dto,
    );
  }

  // get single post
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  getPostById(
    @Param('id', ParseIntPipe) postId: number,
    @GetUser('id') userId: number,
  ) {
    return this.postService.getPostById(
      postId,
      userId,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':slug')
  getPostBySlug(
    @Param('slug') postSlug: string,
    @GetUser('id') userId: number,
  ) {
    return this.postService.getPostBySlug(
      postSlug,
      userId,
    );
  }

  // edit single post
  @UseGuards(JwtGuard)
  @Patch(':id')
  editPostById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: EditPostDto,
  ) {
    return this.postService.editPostById(
      userId,
      postId,
      dto,
    );
  }

  // delete single post
  @UseGuards(JwtGuard)
  @Delete(':id')
  deletePostById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postService.deletePostById(
      userId,
      postId,
    );
  }
}
