import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Item } from './common.js';
import { createTqdm } from '../utils/threads/tqdm.js';
import { limitedArrayMap } from '../utils/threads/threads.js';
import { Offer } from '../entities/Offer.js';

@Injectable()
export class DbOfferService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  public async addOffer(offers: Item[]): Promise<Item[]> {
    const tqdm = createTqdm(offers.length);

    const newOffers: Item[] = [];

    await limitedArrayMap(
      offers,
      tqdm(async (offer) => {
        const existingOffer = await this.em.findOne(Offer, {
          offerLink: offer.offerLink,
        });

        if (existingOffer) {
          return;
        }

        newOffers.push(existingOffer);
        await this.em.persistAndFlush(offer);
      }),
    );

    return newOffers;
  }
}
