import { Injectable } from '@nestjs/common';
import {
  SitemapStream,
  streamToPromise,
} from 'sitemap';
import { PrismaService } from 'src/prisma/prisma.service';
import { Readable } from 'stream';

@Injectable()
export class SitemapService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  async getSitemap() {
    const stream = new SitemapStream({
      hostname: 'https://sebasptsch.dev',
    });
    interface Link {
      url: string;
      changefreq: string;
      priority: number;
    }
    const posts =
      await this.prismaService.post.findMany({
        where: { status: 'PUBLISHED' },
      });
    const postLinks: Link[] = posts.map(
      (post) => ({
        url: `/posts/${post.slug}`,
        changefreq: 'daily',
        priority: 0.3,
      }),
    );
    const defaultLinks: Link[] = [
      {
        url: '/',
        changefreq: 'daily',
        priority: 0.5,
      },
    ];

    const links = [...defaultLinks, ...postLinks];
    return streamToPromise(
      Readable.from(links).pipe(stream),
    ).then((data) => data.toString());
  }
}
