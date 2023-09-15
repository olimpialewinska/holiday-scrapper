import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { IPriceChange, Item } from './common.js';
import { createTqdm } from '../utils/threads/tqdm.js';
import { limitedArrayMap } from '../utils/threads/threads.js';
import { Offer } from '../entities/Offer.js';
import { countries } from '../constants/countires.js';
import { Preferences } from '../entities/Preferences.js';

@Injectable()
export class DbOfferService {
  constructor(private readonly em: EntityManager) {}

  public async addOffer(
    offers: Item[],
  ): Promise<{ newOffers: Item[]; updatedOffers: IPriceChange[] }> {
    const tqdm = createTqdm(offers.length);

    const newOffers: Item[] = [];
    const updatedOffers: IPriceChange[] = [];

    await limitedArrayMap(
      offers,
      tqdm(async (offer) => {
        const existingOffer = await this.em.findOne(Offer, {
          offerLink: offer.offerLink,
        });

        if (!existingOffer) {
          const newOffer = new Offer();
          newOffer.offerLink = offer.offerLink;
          newOffer.title = offer.title;
          newOffer.destination = offer.destination;
          newOffer.countryCode = offer.countryCode;
          newOffer.rating = offer.rating;
          newOffer.pricePerPerson = offer.pricePerPerson;
          newOffer.duration = offer.duration;
          newOffer.startDate = offer.startDate;
          newOffer.endDate = offer.endDate;
          newOffer.provider = offer.provider;
          newOffer.mealType = offer.mealType;
          newOffer.image = offer.image;
          newOffer.mealShort = offer.mealShort;

          newOffers.push(newOffer);
          await this.em.persistAndFlush(newOffer);
        } else if (existingOffer.pricePerPerson !== offer.pricePerPerson) {
          existingOffer.pricePerPerson = offer.pricePerPerson;
          await this.em.flush();
          updatedOffers.push({
            oldOffer: existingOffer,
            newPrice: offer.pricePerPerson,
          });
        }
      }),
    );

    return {
      newOffers,
      updatedOffers,
    };
  }

  public async getMaxPrice(): Promise<number> {
    const maxPrice = await this.em.execute(
      `
      SELECT MAX(price_per_person) FROM preferences
      group by price_per_person
      order by price_per_person desc limit 1;
    `,
    );

    return maxPrice[0].max ? maxPrice[0].max : 3000;
  }
}
