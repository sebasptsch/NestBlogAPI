import {
  Controller,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  SitemapStream,
  streamToPromise,
} from 'sitemap';
import { PrismaService } from 'src/prisma/prisma.service';
import { createGzip } from 'zlib';
import { SitemapService } from './sitemap.service';

let sitemap;

@ApiTags('Root')
@Controller()
export class SitemapController {
  constructor(
    private readonly sitemapService: SitemapService,
    private readonly prismaService: PrismaService,
  ) {}
  @Get('sitemap.xml')
  async getSitemap(
    @Res() res: Response,
    @Req() req: Request,
  ) {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    if (sitemap) {
      res.send(sitemap);

      return;
    }
    try {
      const smStream = new SitemapStream({
        hostname: 'https://sebasptsch.dev/',
      });
      const pipeline = smStream.pipe(
        createGzip(),
      );

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

      const links: Link[] = [
        ...defaultLinks,
        ...postLinks,
      ];

      // pipe your entries or directly write them.
      links.forEach((link) => {
        smStream.write(link);
      });
      /* or use
      Readable.from([{url: '/page-1'}...]).pipe(smStream)
      if you are looking to avoid writing your own loop.
      */

      // cache the response
      streamToPromise(pipeline).then(
        (sm) => (sitemap = sm),
      );
      // make sure to attach a write stream such as streamToPromise before ending
      smStream.end();
      // stream write the response
      pipeline.pipe(res).on('error', (e) => {
        throw e;
      });
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  }
}
