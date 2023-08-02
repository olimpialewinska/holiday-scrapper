import { Injectable } from '@nestjs/common';
import { Item, Scrapper } from './common.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { exec } from '../utils/child_process.js';

@Injectable()
export class TravelScrapper implements Scrapper {
  public async fetch(maxPrice: number): Promise<Item[]> {
    let page = 1;
    let lastPrice = 0;

    const items: Item[] = [];

    const date = new Date();
    const day = String(date.getDate() + 1).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const dateStr = `${day}.${month}.${year}`;

    const baseUrl = `https://www.travelplanet.pl/wakacje/?s_action=TRIPS_SEARCH&d_start_from=${dateStr}&nl_category_id%5B0%5D=1&nl_transportation_id%5B0%5D=3&s_holiday_target=tours&sort=c_price`;
    const additionalParams = `&nl_not_ck_id%5B0%5D=102556&b_private_offers=1&nl_occupancy_adults=2`;
    try {
      while (lastPrice <= maxPrice) {
        const url = `${baseUrl}&page=${page}${additionalParams}${this.getOffsets(
          page,
        )}`;

        const result = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0',
          },
        });

        const html = result.data;

        const $ = cheerio.load(html);

        $('div.b-product-list-2__inner').each((index, element) => {
          const offerElement = $(element);

          const offerLink = offerElement
            .find('h2.b-product-list-2__title a')
            .attr('href');
          const title = offerElement
            .find('h2.b-product-list-2__title a')
            .text()
            .trim();

          const date = offerElement
            .find('li.tour-params__item span.item-icon__text')
            .eq(2)
            .text()
            .trim()
            .replace(/[^\d.-]+/g, '');

          const endDateStr = date.split('-')[1].trim();
          const startDateStr =
            date.split('-')[0] + endDateStr.split('.')[2].trim();

          const startDate = this.parseCustomDate(startDateStr);
          const endDate = this.parseCustomDate(endDateStr);

          const duration = startDateStr + '-' + endDateStr;

          const mealType = offerElement
            .find('li.tour-params__item span.item-icon__text')
            .eq(3)
            .text()
            .trim();

          //delet all white spaces
          const pricePerPerson = offerElement
            .find('strong.price__highlight')
            .text()
            .replace(/\s/g, '');

          const styleAttributeValue = offerElement
            .find('span.stars')
            .attr('style');

          const widthMatch = styleAttributeValue.match(/width:\s*(\d+)/);

          let width = null;
          if (widthMatch && widthMatch[1]) {
            width = parseInt(widthMatch[1], 10);
          }
          const rating = width ? width / 12 : null;

          const provider = 'https://www.travelplanet.pl';

          const destination = offerElement
            .find('p.b-product-list-2__location')
            .text()
            .trim();

          const offerInfo = {
            offerLink,
            title,
            destination,
            rating,
            pricePerPerson,
            duration,
            startDate,
            endDate,
            mealType,
            provider,
          };

          items.push(offerInfo);
        });

        lastPrice = parseInt(items[items.length - 1].pricePerPerson, 10);

        page++;
      }
    } catch (error) {}
    return [];
  }

  private parseCustomDate(dateStr: string): Date {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  }

  private getOffsets(page: number): string {
    if (page === 1) {
      return '';
    } else {
      const offsetTraveltainment = (page - 1) * 15;
      const offsetTraso = page - 1;
      const offsetInvia = page - 1;
      const offsetMerlinX = (page - 1) * 15;
      const offsetHotel = 0;
      const itemsPerPage = 15;
      const boxesFound = 15;

      return `&offsets=traveltainment%3A${offsetTraveltainment}%3Btraso%3A${offsetTraso}%3Binvia%3A${offsetInvia}%3BmerlinX%3A${offsetMerlinX}%3Bhotel%3A${offsetHotel}%3BitemsPerPage%3A${itemsPerPage}%3BboxesFound%3A${boxesFound}`;
    }
  }
}
