import { Injectable } from '@nestjs/common';
import { Item, Scrapper } from './common.js';

@Injectable()
export class FlyScrapper implements Scrapper {
  public async fetch(): Promise<Item[]> {
    return [];
  }
}
