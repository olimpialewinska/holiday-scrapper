import { Injectable } from '@nestjs/common';
import { Item, Scrapper } from './common';
import * as cheerio from 'cheerio';
import { exec } from '../utils/child_process.js';

const maxPrice = 1500;

@Injectable()
export class WakacjeScrapper implements Scrapper {
  public async fetch(): Promise<Item[]> {
    let lastPrice = 0;
    let page = 1;

    const items: Item[] = [];

    try {
      while (lastPrice <= maxPrice) {
        const result = await exec([
          'curl',
          `--location "https://www.wakacje.pl/lastminute/?str-${page},samolotem,tanio"`,
        ]);

        const html = result.out.toString();

        const $ = cheerio.load(html);

        $('a[data-test-offer-id]').each((index, element) => {
          const destination = $(element)
            .find('span[data-testid="offer-listing-geo"]')
            .text();
          const title = $(element)
            .find('span[data-testid="offer-listing-name"]')
            .text();
          const rating = $(element)
            .find(
              '.yzr5qg-2.klYBgC.nmbz4g-6.HhwrO .sc-jfJzZe.bcQBUy .sc-jSgupP.hKopHK',
            )
            .text();
          const duration = $(element)
            .find('span[data-testid="offer-listing-duration-date"]')
            .text()
            .trim();
          const pricePerPerson = $(element)
            .find('h4.sc-1x38ct5-4.sc-1v2crin-2.kuYJpT.jRRgxG')
            .text()
            .trim()
            .replace(/\D/g, '');
          const offerLink = $(element).attr('href');

          const offerInfo = {
            offerLink,
            title,
            destination,
            rating,
            pricePerPerson,
            duration,
            provider: 'https://www.wakacje.pl',
          };

          items.push(offerInfo);
        });

        lastPrice = parseInt(items[items.length - 1].pricePerPerson, 10);

        console.log('last', lastPrice);
        page++;
      }
      return items;
    } catch (e) {
      return [];
    }
  }
}
