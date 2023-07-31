import { Module } from '@nestjs/common';

import { WakacjeScrapper } from './wakacje-scrapper.js';
import { ScrapperService } from './scrapper-service.js';
import { FlyScrapper } from './fly-scrapper.js';
import { TravelScrapper } from './travel-scrapper.js';

@Module({
  imports: [],
  controllers: [],
  providers: [ScrapperService, WakacjeScrapper, FlyScrapper, TravelScrapper],
  exports: [ScrapperService, WakacjeScrapper, FlyScrapper, TravelScrapper],
})
export class ScrapperModule {}
