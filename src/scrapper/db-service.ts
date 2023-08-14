import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Item } from './common.js';
import { createTqdm } from '../utils/threads/tqdm.js';
import { limitedArrayMap } from '../utils/threads/threads.js';
import { Offer } from '../entities/Offer.js';

@Injectable()
export class DbOfferService {
  constructor(private readonly em: EntityManager) {}

  public async addOffer(offers: Item[]): Promise<Item[]> {
    const tqdm = createTqdm(offers.length);

    const newOffers: Item[] = [];

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
          newOffer.rating = offer.rating;
          newOffer.pricePerPerson = offer.pricePerPerson;
          newOffer.duration = offer.duration;
          newOffer.startDate = offer.startDate;
          newOffer.endDate = offer.endDate;
          newOffer.provider = offer.provider;
          newOffer.mealType = offer.mealType;
          newOffer.image = offer.image;

          newOffers.push(newOffer);
          await this.em.persistAndFlush(newOffer);
        }
      }),
    );

    return newOffers;
  }

  public async getMaxPrice() {}
}
