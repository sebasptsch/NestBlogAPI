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
import { GetUser } from '../auth/decorator';
import {
  CreatePostDto,
  EditPostDto,
} from './dto';
import { PostService } from './post.service';
import { Request } from 'express';
import { SessionGuard } from 'src/auth/guard';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  // get all posts

  @Get()
  getPosts(@GetUser('id') userId: number) {
    return this.postService.getPosts(userId);
  }

  // create post
  @UseGuards(SessionGuard)
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
  @UseGuards(SessionGuard)
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
  @UseGuards(SessionGuard)
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
