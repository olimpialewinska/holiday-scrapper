import { Injectable } from '@nestjs/common';
import { Item, Scrapper, parseDate } from './common.js';
import { exec } from '../utils/child_process.js';
import * as cheerio from 'cheerio';

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
          const ratingString =
            offerElement.find('.rating').attr('class')?.split('-')[1] || '0';

          const rating = parseFloat(ratingString.replace(',', '.'));

          const specificDiv = $(element).find('div i.icon-cutlery').parent();
          const mealType = specificDiv.find('span').text().trim();

          const dateRange = $('div.info span').first().text().trim();

          const dateRangePattern =
            /\d{2}\.\d{2}\.\d{4}\s*-\s*\d{2}\.\d{2}\.\d{4}/;

          const duration = dateRange.match(dateRangePattern)[0];

          const startDateStr = duration?.split(' - ')[0].trim();
          const endDateStr = duration?.split('-')[1].trim();

          const startDate = parseDate(startDateStr);
          const endDate = parseDate(endDateStr);

          const pricePerPersonString = offerElement
            .find('meta[property="schema:price"]')
            .attr('content');

          const pricePerPerson = parseInt(pricePerPersonString, 10);

          const image = $(element).find('a.image-link img').attr('data-src');

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
            image: image,
            mealType: mealType,
          };

          items.push(offerInfo);
        });

        lastPrice = items[items.length - 1]?.pricePerPerson || 0;

        page++;
      }
    } catch (error) {
      return [];
    }
    return items;
  }
}
