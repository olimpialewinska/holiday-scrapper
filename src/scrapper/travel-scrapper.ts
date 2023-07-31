import { Injectable } from '@nestjs/common';
import { Item, Scrapper } from './common.js';

@Injectable()
export class TravelScrapper implements Scrapper {
  public async fetch(): Promise<Item[]> {
    return [];
  }
}
