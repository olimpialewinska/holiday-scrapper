import { Injectable } from '@nestjs/common';
import { Item, Scrapper, parseDate } from './common.js';
import * as cheerio from 'cheerio';
import { exec } from '../utils/child_process.js';
import { countries } from '../constants/countires.js';

@Injectable()
export class WakacjeScrapper implements Scrapper {
  public async fetch(maxPrice: number): Promise<Item[]> {
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
            .first()
            .text();
          const ratingElement = $(element)
            .find('div.ctm1ix-9.bTrdyn')
            .attr('title');

          const rating = parseInt(ratingElement.split(' ')[0]);

          const duration = $(element)
            .find('span[data-testid="offer-listing-duration-date"]')
            .text()
            .trim();
          const pricePerPersonString = $(element)
            .find('h4.sc-1x38ct5-4.sc-1v2crin-2.kuYJpT.jRRgxG')
            .text()
            .trim()
            .replace(/\D/g, '');

          const pricePerPerson = parseInt(pricePerPersonString, 10);
          const offerLink = $(element).attr('href');

          const [startDateStr, endDateStr] = duration
            .split('- ')
            .map((date) => date.trim());

          const startDate = parseDate(startDateStr);
          const endDate = parseDate(endDateStr);

          const image = $(element).find('img.sc-1atahpb-3.kOWime').attr('src');
          const mealType = $(element)
            .find('span[data-testid="offer-listing-services"]')
            .text()
            .trim();

          const mealShort = this.unifyMealType(mealType);

          const countryCode = countries.find(
            (country) => country.country === destination.split(/\/|\s/)[0],
          ).code;

          const offerInfo = {
            offerLink: `https://www.wakacje.pl${offerLink}`,
            title,
            destination,
            rating,
            pricePerPerson,
            duration,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            provider: 'https://www.wakacje.pl',
            image: image,
            mealType: mealType,
            mealShort,
            countryCode,
          };

          items.push(offerInfo);
        });

        lastPrice = items[items.length - 1].pricePerPerson;

        page++;
      }
      return items;
    } catch (e) {
      return [];
    }
  }

  private unifyMealType(mealType) {
    switch (mealType) {
      case 'All inclusive':
      case 'All Inclusive':
        return 'All';
      case 'śniadania i obiadokolacje':
        return 'HB';
      case 'śniadania':
        return 'BB';
      case 'trzy posiłki':
        return 'FB';
      case 'bez wyżywienia':
        return 'RO';
      case 'zgodnie z programem':
        return 'AI';
      default:
        return '';
    }
  }
}
