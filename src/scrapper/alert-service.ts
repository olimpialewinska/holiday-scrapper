import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../entities/User.js';
import { Item } from './common.js';

export class AlertService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  //   public async comparePreferencesWithOffers(newOffers): Promise<void> {
  //     const users = await this.getAllUsersWithPreferences();
  //     users.forEach((user) => {
  //       const userPreferences = user.preferences;
  //       const matchingOffers = [];

  //       newOffers.forEach((offer: Item) => {
  //         if (offer.destination === userPreferences.destination) {
  //           if (offer.pricePerPerson <= userPreferences.pricePerPerson) {
  //             matchingOffers.push(offer);
  //           }
  //         }
  //       });

  //       if (matchingOffers.length > 0) {
  //         this.sendEmailToUser(user, matchingOffers);
  //       }
  //     });
  //   }

  //   public async getAllUsersWithPreferences(): Promise<User[]> {
  //     return this.em.find(User, {}, { populate: ['preferences'] });
  //   }

  public async sendEmailToUser(user: User, offers: Item[]): Promise<void> {
    console.log('Wysyłam maila do użytkownika', user.email);
  }
}
