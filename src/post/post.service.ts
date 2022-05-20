import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  DraftStatus,
  Prisma,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePostDto,
  EditPostDto,
} from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  // get all posts

  async getMyPosts(userId: number) {
    return this.prisma.post.findMany({
      where: {
        userId,
      },
    });
  }

  async getPosts(userId?: number | undefined) {
    if (!userId) {
      return this.prisma.post.findMany({
        where: {
          status: DraftStatus.PUBLISHED,
        },
      });
    } else {
      return this.prisma.post.findMany({
        where: {
          OR: [
            {
              status: DraftStatus.DRAFT,
              userId,
            },
            {
              status: DraftStatus.PUBLISHED,
            },
          ],
        },
      });
    }
  }

  // create post

  async createPost(
    userId: number,
    dto: CreatePostDto,
  ) {
    try {
      const post = await this.prisma.post.create({
        data: {
          ...dto,
          slug: dto.title
            .toLowerCase()
            .replace(
              /[^a-zA-Z0-9]+(.)/g,
              (m, chr) => '-' + chr,
            )
            .trim(),
          user: {
            connect: { id: userId },
          },
        },
      });

      return post;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Either your slug or title is not unique.',
          );
        }
      }
    }
  }

  // get single post

  async getPostById(
    postId: number,
    userId?: number,
  ) {
    if (userId) {
      const post =
        await this.prisma.post.findFirst({
          where: {
            OR: [
              {
                id: postId,
                status: DraftStatus.PUBLISHED,
              },
              {
                id: postId,
                userId: userId,
              },
            ],
          },
        });

      return post;
    } else {
      const post =
        await this.prisma.post.findFirst({
          where: {
            id: postId,
            status: DraftStatus.PUBLISHED,
          },
        });

      return post;
    }
  }

  async getPostBySlug(
    postSlug: string,
    userId?: number,
  ) {
    if (userId) {
      const post =
        await this.prisma.post.findFirst({
          where: {
            OR: [
              {
                slug: postSlug,
                status: DraftStatus.PUBLISHED,
              },
              {
                slug: postSlug,
                userId: userId,
              },
            ],
          },
        });

      return post;
    } else {
      const post =
        await this.prisma.post.findFirst({
          where: {
            OR: [
              {
                slug: postSlug,
                status: DraftStatus.PUBLISHED,
              },
            ],
          },
        });

      return post;
    }
  }

  // edit single post

  async editPostById(
    userId: number,
    postId: number,
    dto: EditPostDto,
  ) {
    const post =
      await this.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
    if (!post || post.userId !== userId) {
      throw new ForbiddenException(
        'Access to resource denied',
      );
    }

    return this.prisma.post.update({
      where: {
        id: postId,
      },
      data: { ...dto },
    });
  }

  // delete single post

  async deletePostById(
    userId: number,
    postId: number,
  ) {
    const post =
      await this.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
    if (!post || post.userId !== userId) {
      throw new ForbiddenException(
        'Access to resource denied',
      );
    }

    return this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}
