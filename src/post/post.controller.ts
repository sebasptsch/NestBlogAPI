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
import { PostService } from './post.service.js';
import { Request } from 'express';
import { SessionGuard } from '../auth/guard/index.js';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  OmitType,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { GetPostsDto } from './dto/getPostsInput.dto.js';
import { GetPostWithUserDto } from './dto/GetPostWithUser.dto.js';
import { MinimalPostDto } from './dto/MinimalPost.dto.js';
import { CreatePostDto } from './dto/CreatePost.dto.js';
import { EditPostDto } from './dto/EditPost.dto.js';
import { PostDto } from './dto/Post.dto.js';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  /** Get a list of posts (if you're logged in then you get your own draft posts as well) */

  @Get()
  @ApiOkResponse({ type: [MinimalPostDto] })
  @ApiOperation({ operationId: 'getPosts' })
  getPosts(
    @Query() { take, cursor }: GetPostsDto,
  ) {
    return this.postService.posts({
      where: {
        status: 'PUBLISHED',
      },
      skip: cursor ? 1 : undefined,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      take,
      select: {
        id: true,
        status: true,
        slug: true,
        title: true,
        summary: true,
        content: false,
        userId: true,
        createdAt: true,
        publishedAt: true,
        updatedAt: true,
        bannerSrc: true,
      },
    });
  }

  /** Get a list of posts belonging to the logged in user */
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @ApiOperation({ operationId: 'getMyPosts' })
  @ApiOkResponse({
    type: [MinimalPostDto],
  })
  @Get('me')
  getMyPosts(
    @GetUser('id') userId: number,
    @Query('cursor')
    { cursor, take }: GetPostsDto,
  ) {
    return this.postService.posts({
      where: {
        userId,
      },
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      skip: cursor ? 1 : undefined,
      take,
      select: {
        id: true,
        status: true,
        slug: true,
        title: true,
        summary: true,
        content: false,
        userId: true,
        createdAt: true,
        publishedAt: true,
        updatedAt: true,
        bannerSrc: true,
      },
    });
  }

  /** Create a new post */
  @UseGuards(SessionGuard)
  @ApiOperation({ operationId: 'createPost' })
  @ApiCookieAuth()
  @ApiCreatedResponse({
    type: GetPostWithUserDto,
  })
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
  @ApiOperation({ operationId: 'getPostById' })
  @ApiOkResponse({ type: GetPostWithUserDto })
  getPostById(
    @Param('id', ParseIntPipe)
    postId: number,
    @GetUser('id') userId: number,
  ) {
    return this.postService.getPostById(
      postId,
      userId,
    );
  }

  /** Retreive a post by it's Slug */
  @Get('slug/:slug')
  @ApiOperation({ operationId: 'getPostBySlug' })
  @ApiOkResponse({ type: GetPostWithUserDto })
  getPostBySlug(
    @Param('slug') postSlug: PostDto['slug'],
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
  @ApiOperation({ operationId: 'editPostById' })
  @ApiOkResponse({ type: GetPostWithUserDto })
  @Roles('ADMIN')
  @Patch(':id')
  editPostById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    postId: number,
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
  @ApiOperation({ operationId: 'deletePostById' })
  @ApiOkResponse({ type: GetPostWithUserDto })
  @Roles('ADMIN')
  @Delete(':id')
  deletePostById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    postId: number,
  ) {
    return this.postService.deletePostById(
      userId,
      postId,
    );
  }
}
