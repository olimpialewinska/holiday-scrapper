import { Injectable } from '@nestjs/common';
import { Item, Scrapper, parseDate } from './common.js';
import { exec } from '../utils/child_process.js';
import * as cheerio from 'cheerio';
import { off } from 'process';

@Injectable()
export class FlyScrapper implements Scrapper {
  public async fetch(maxPrice: number): Promise<Item[]> {
    let lastPrice = 0;
    let page = 1;

    const items: Item[] = [];

    try {
      while (lastPrice <= maxPrice) {
        const result = await exec([
          'curl',
          `--location "https://fly.pl/oferta/last-minute/oferta/p:${page}/"`,
        ]);

        const html = result.out.toString();

        const $ = cheerio.load(html);

        $('div.card-offer-search.price-pos').each((index, element) => {
          const offerElement = $(element);

          const offerLink = offerElement.find('h2.title a').attr('href');
          const title = offerElement.find('h2.title a').text();
          const destination = offerElement
            .find('ol.meta-breadcrumbs li')
            .map((_, el) => $(el).text())
            .get()
            .join('/');
          const rating =
            offerElement
              .find('.rating.rating-3')
              .attr('class')
              ?.split('-')[1] || '0';

          const dateRange = $('div.info span').first().text().trim();

          const dateRangePattern =
            /\d{2}\.\d{2}\.\d{4}\s*-\s*\d{2}\.\d{2}\.\d{4}/;

          const duration = dateRange.match(dateRangePattern)[0];

          const startDateStr = duration?.split(' - ')[0].trim();
          const endDateStr = duration?.split('-')[1].trim();

          const startDate = parseDate(startDateStr);
          const endDate = parseDate(endDateStr);

          const pricePerPerson = offerElement
            .find('meta[property="schema:price"]')
            .attr('content');

          const offerInfo = {
            offerLink,
            title,
            destination,
            rating,
            pricePerPerson,
            duration,
            startDate,
            endDate,
            provider: 'https://fly.pl/',
          };
          console.log(offerInfo);

          items.push(offerInfo);
        });

        lastPrice = parseInt(items[items.length - 1].pricePerPerson, 10);

        page++;
      }
    } catch (error) {
      console.error(error);
    }

    return [];
  }
}
