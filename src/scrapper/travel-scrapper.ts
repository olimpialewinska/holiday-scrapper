import { Injectable } from '@nestjs/common';
import { Item, Scrapper } from './common.js';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

@Injectable()
export class TravelScrapper implements Scrapper {
  public async fetch(maxPrice: number): Promise<Item[]> {
    let lastPrice = 0;

    const items: Item[] = [];

    const date = new Date();
    const day = String(date.getDate() + 1).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const dateStr = `${day}.${month}.${year}`;
    const baseUrl = `https://www.travelplanet.pl/wakacje/?s_action=TRIPS_SEARCH&d_start_from=${dateStr}&nl_category_id%5B0%5D=1&nl_transportation_id%5B0%5D=3&s_holiday_target=tours&sort=c_price&nl_occupancy_adults=1`;

    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const browserPage = await browser.newPage();

    await browserPage.goto(baseUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await browserPage.waitForSelector(
      '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    );

    await browserPage.click(
      '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    );

    try {
      while (lastPrice <= maxPrice) {
        await browserPage.waitForSelector('.loader__loader', {
          hidden: true,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const html = await browserPage.content();
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

          const pricePerPersonString = offerElement
            .find('strong.price__highlight')
            .text()
            .replace(/\s/g, '');

          const pricePerPerson = parseInt(pricePerPersonString, 10);

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

          const image = $(element).find('img.img__img').attr('src');

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
            image: image,
          };

          items.push(offerInfo);
        });

        lastPrice = items[items.length - 1]?.pricePerPerson;

        const nextPageButtonSelector =
          'button.pagination__link.pagination__link--next';
        await browserPage.waitForSelector(nextPageButtonSelector, {
          visible: true,
        });
        const nextPageButton = await browserPage.$(nextPageButtonSelector);

        if (nextPageButton) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await nextPageButton.click();

          await new Promise((resolve) => setTimeout(resolve, 1000));

          await browserPage.waitForSelector('.loader__loader', {
            hidden: false,
          });

          await browserPage.waitForTimeout(1000);
        } else {
          break;
        }
      }
    } catch (error) {
      return [];
    } finally {
      await browser.close();
    }

    const deduplikatedItems = Array.from(new Set(items));
    return deduplikatedItems;
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
}
