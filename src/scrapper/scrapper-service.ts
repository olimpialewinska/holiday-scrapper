import { Injectable } from '@nestjs/common';
import { WakacjeScrapper } from './wakacje-scrapper.js';
import { Scrapper } from './common.js';
import { FlyScrapper } from './fly-scrapper.js';
import { TravelScrapper } from './travel-scrapper.js';
import { DbOfferService } from './db-service.js';
import { AlertService } from './alert-service.js';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly wakacjeScrapper: WakacjeScrapper,
    private readonly flyScrapper: FlyScrapper,
    private readonly travelScrapper: TravelScrapper,
    private readonly dbService: DbOfferService,
    private readonly alertService: AlertService,
  ) {}

  public get scrappers(): Scrapper[] {
    return [this.wakacjeScrapper, this.flyScrapper, this.travelScrapper];
  }

  public async run(): Promise<void> {
    const maxPrice = await this.dbService.getMaxPrice();
    const promises = this.scrappers.map((scrapper) => scrapper.fetch(maxPrice));
    const allItems = await Promise.all(promises);

    const items = allItems.flat();

    const newOffers = await this.dbService.addOffer(items);

    await this.alertService.sendOffers(newOffers);
  }
  public async startScheduledScraping(): Promise<void> {
    await this.run();
    setInterval(async () => {
      await this.run();
    }, 1000 * 60 * 10);
  }
}
