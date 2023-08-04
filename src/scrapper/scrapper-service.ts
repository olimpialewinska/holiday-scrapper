import { Injectable } from '@nestjs/common';
import { WakacjeScrapper } from './wakacje-scrapper.js';
import { Scrapper } from './common.js';
import { FlyScrapper } from './fly-scrapper.js';
import { TravelScrapper } from './travel-scrapper.js';
import { DbOfferService } from './db-service.js';

const maxPrice = 1000;

@Injectable()
export class ScrapperService {
  constructor(
    private readonly wakacjeScrapper: WakacjeScrapper,
    private readonly flyScrapper: FlyScrapper,
    private readonly travelScrapper: TravelScrapper,
    private readonly dbService: DbOfferService,
  ) {}

  public get scrappers(): Scrapper[] {
    return [this.wakacjeScrapper, this.flyScrapper, this.travelScrapper];
  }

  public async run(): Promise<void> {
    console.log('Running scrapper');

    const promises = this.scrappers.map((scrapper) => scrapper.fetch(maxPrice));
    const allItems = await Promise.all(promises);

    const items = allItems.flat();

    const newOffers = await this.dbService.addOffer(items);

    console.log(`Added ${newOffers.length} new offers`);
  }
  public async startScheduledScraping(): Promise<void> {
    await this.run();
    setInterval(async () => {
      await this.run();
    }, 1000 * 60 * 60);
  }
}
