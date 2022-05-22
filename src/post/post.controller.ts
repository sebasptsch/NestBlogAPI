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
import {
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  /** Get a list of posts (if you're logged in then you get your own draft posts as well) */
  @Get()
  @ApiCookieAuth()
  getPosts(@GetUser('id') userId: number) {
    return this.postService.getPosts(userId);
  }

  /** Get a list of posts belonging to the logged in user */
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @Roles('ADMIN')
  @Get('me')
  getMyPosts(@GetUser('id') userId: number) {
    return this.postService.getMyPosts(userId);
  }

  /** Create a new post */
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @Roles('ADMIN')
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

  /** Get a post by it's Id */
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

  /** Retreive a post by it's Slug */
  @Get('slug/:slug')
  getPostBySlug(
    @Param('slug') postSlug: string,
    @GetUser('id') userId: number,
  ) {
    return this.postService.getPostBySlug(
      postSlug,
      userId,
    );
  }

  /** Edit a post */
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @Roles('ADMIN')
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

  /** Delete a post */
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @Roles('ADMIN')
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
