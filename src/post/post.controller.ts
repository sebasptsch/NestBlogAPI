import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/index.js';
import {
  CreatePostDto,
  EditPostDto,
} from './dto/index.js';
import { PostService } from './post.service.js';
import { Request } from 'express';
import { SessionGuard } from '../auth/guard/index.js';
import {
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator.js';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  /** Get a list of posts (if you're logged in then you get your own draft posts as well) */
  @Get()
  getPosts(
    @Query('cursor')
    cursorParam: string,
    @Query('take') takeParam: string,
  ) {
    const cursor = cursorParam
      ? {
          id: parseInt(cursorParam),
        }
      : undefined;
    const take = takeParam
      ? parseInt(takeParam)
      : undefined;
    return this.postService.posts({
      where: {
        status: 'PUBLISHED',
      },
      skip: cursor ? 1 : undefined,
      cursor,
      take,
      select: {
        id: true,
        status: true,
        slug: true,
        title: true,
        summary: true,
        content: false,
        user: false,
        userId: true,
        createdAt: false,
        publishedAt: true,
        updatedAt: false,
        bannerSrc: true,
      },
    });
  }

  /** Get a list of posts belonging to the logged in user */
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @Roles('ADMIN')
  @Get('me')
  getMyPosts(
    @GetUser('id') userId: number,
    @Param('cursor') cursorParam?: string,
    @Param('take') takeParam?: string,
  ) {
    const cursor = cursorParam
      ? {
          id: parseInt(cursorParam),
        }
      : undefined;
    const take = takeParam
      ? parseInt(takeParam)
      : undefined;
    console.log(take);
    return this.postService.posts({
      where: {
        userId,
      },
      cursor,
      skip: cursor ? 1 : undefined,
      take,
      select: {
        id: true,
        status: true,
        slug: true,
        title: true,
        summary: true,
        content: false,
        user: false,
        userId: true,
        createdAt: false,
        publishedAt: true,
        updatedAt: false,
        bannerSrc: true,
      },
    });
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
