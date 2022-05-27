import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({
  providers: [SitemapService],
  controllers: [SitemapController],
})
export class SitemapModule {}
