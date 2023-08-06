import { Module } from '@nestjs/common';

import { WakacjeScrapper } from './wakacje-scrapper.js';
import { ScrapperService } from './scrapper-service.js';
import { FlyScrapper } from './fly-scrapper.js';
import { TravelScrapper } from './travel-scrapper.js';
import { DbOfferService } from './db-service.js';
import { AlertService } from './alert-service.js';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ScrapperService,
    WakacjeScrapper,
    FlyScrapper,
    TravelScrapper,
    DbOfferService,
    AlertService,
  ],

  exports: [
    ScrapperService,
    WakacjeScrapper,
    FlyScrapper,
    TravelScrapper,
    DbOfferService,
    AlertService,
  ],
})
export class ScrapperModule {}
