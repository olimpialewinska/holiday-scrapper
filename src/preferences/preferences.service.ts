import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { ISearchQuery } from '../common/ISearchQuery.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { Offer } from '../entities/Offer.js';
import { start } from 'repl';

@Injectable()
export class PreferencesService {
  constructor(
    private usersService: UsersService,
    private readonly em: EntityManager,
  ) {}

  async addPreferences(email: string, preferences: any): Promise<any> {
    return await this.usersService.addPreferences(email, preferences);
  }

  async getPreferences(email: string): Promise<any> {
    return await this.usersService.getPreferences(email);
  }

  async getAllOffers(order: 'asc' | 'desc' | 'stars'): Promise<any> {
    const orderObj = this.getOrderObject(order);
    return await this.em.find(
      Offer,
      {},
      {
        orderBy: orderObj,
      },
    );
  }

  async getOffers(data: ISearchQuery): Promise<any> {
    const filters: any = {};
    let sort: any = {};

    if (data.destination) {
      filters.destination = { $ilike: `%${data.destination}%` };
    }

    if (data.maxPrice) {
      filters.pricePerPerson = { $lte: data.maxPrice };
    }

    if (data.stars) {
      filters.rating = { $gte: data.stars };
    }

    if (data.startDate) {
      const startDate = new Date(data.startDate);
      filters.startDate = { $gte: startDate };
    }

    if (data.endDate) {
      const endDate = new Date(data.endDate);
      filters.endDate = { $lte: endDate };
    }

    if (data.nutrition) {
      const items = data.nutrition.split(',');
      items.push('');
      filters.mealShort = { $in: items };
    }

    if (data.sort) {
      sort = this.getOrderObject(data.sort);
    }

    const offers = await this.em.find(Offer, filters, { orderBy: sort });

    return offers;
  }

  async getDestinations(): Promise<any> {
    const destinations = await this.em.find(
      Offer,
      {},
      {
        fields: ['destination'],
        orderBy: { destination: 'ASC' },
      },
    );

    const destinationNames = [
      ...new Set(
        destinations.map(
          (destination) => destination.destination.split(/\/|\s/)[0],
        ),
      ),
    ];
    return destinationNames;
  }

  async getPrices(): Promise<any> {
    const prices = await this.em.find(
      Offer,
      {},
      {
        fields: ['pricePerPerson'],
      },
    );

    const priceValues = prices.map((price) => price.pricePerPerson);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);

    return { minPrice, maxPrice };
  }

  async getDedicatedOffers(
    email: string,
    order: 'asc' | 'desc' | 'stars',
  ): Promise<any> {
    const preferences = await this.usersService.getPreferences(email);

    const orderObj = this.getOrderObject(order);

    const offers = await this.em.find(
      Offer,
      {
        pricePerPerson: { $lte: preferences.price },
        rating: { $gte: preferences.rating },
        countryCode: { $in: preferences.destination },
        mealShort: { $in: preferences.mealType },
      },
      {
        orderBy: orderObj,
      },
    );

    const matchingOffers = offers.filter((offer) => {
      const duration = this.countDuration(offer.startDate, offer.endDate);
      return this.matchDuration(preferences.duration, duration);
    });

    console.log(matchingOffers);

    return matchingOffers;
  }

  private getOrderObject(order: 'asc' | 'desc' | 'stars') {
    let orderObj;

    if (order === 'asc') {
      orderObj = { pricePerPerson: 'ASC' };
    } else if (order === 'desc') {
      orderObj = { pricePerPerson: 'DESC' };
    } else {
      orderObj = { rating: 'DESC' };
    }

    return orderObj;
  }

  private countDuration(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  private matchDuration(pref: number, duration: number) {
    if (pref === 3 && duration <= 3) {
      return true;
    }
    if (pref === 7 && duration <= 7) {
      return true;
    }
    if (pref === 14 && duration <= 14) {
      return true;
    }
    if (pref === 21 && duration <= 21) {
      return true;
    }

    return true;
  }
}
