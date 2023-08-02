import { Injectable } from '@nestjs/common';
import { WakacjeScrapper } from './wakacje-scrapper.js';
import { Scrapper } from './common.js';
import { FlyScrapper } from './fly-scrapper.js';
import { TravelScrapper } from './travel-scrapper.js';

const maxPrice = 2000;

@Injectable()
export class ScrapperService {
  constructor(
    private readonly wakacjeScrapper: WakacjeScrapper,
    private readonly flyScrapper: FlyScrapper,
    private readonly travelScrapper: TravelScrapper,
  ) {}

  // public get scrappers(): Scrapper[] {
  //   return [this.wakacjeScrapper, this.flyScrapper, this.travelScrapper];
  // }

  // public async run(): Promise<void> {
  //   for (const scrapper of this.scrappers) {
  //     const items = await scrapper.fetch(maxPrice);
  //     console.log(items);
  //   }
  // }

  public async run(): Promise<void> {
    const flyScrapperItems = await this.travelScrapper.fetch(maxPrice);
  }
}
