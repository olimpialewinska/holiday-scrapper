import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Users } from '../entities/User.js';
import { Item } from './common.js';
import { Preferences } from '../entities/Preferences.js';
import { createTqdm } from '../utils/threads/tqdm.js';
import { limitedArrayMap } from '../utils/threads/threads.js';
import { NodemailerService } from '../utils/nodemailer-config.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertService {
  constructor(
    private readonly em: EntityManager,
    private readonly transporter: NodemailerService,
  ) {}

  public async sendOffers(newOffers: Item[]): Promise<void> {
    const users = await this.getAllUsers();

    const tqdm = createTqdm(users.length);

    await limitedArrayMap(
      users,
      tqdm(async (user) => {
        const userPreferences = await this.getPreferences(user.id);

        if (!userPreferences) {
          return;
        }

        const matchingOffers: Item[] = [];

        newOffers.forEach((offer: Item) => {
          if (offer.pricePerPerson <= userPreferences.pricePerPerson) {
            matchingOffers.push(offer);
          }
        });

        if (matchingOffers.length > 0) {
          this.sendEmailToUser(user, matchingOffers);
        }
      }),
    );
  }

  async getAllUsers(): Promise<Users[]> {
    const userRepository = this.em.getRepository(Users);
    const users = await userRepository.findAll();

    return users;
  }

  private async getPreferences(userId: number) {
    return await this.em.findOne(Preferences, { userId: userId });
  }

  private async sendEmailToUser(user: Users, offers: Item[]): Promise<void> {
    const html = `<h1>Hi ${
      user.email
    }!</h1> <p>Here are some offers that match your preferences:</p><ul>  ${offers
      .map((offer) => `<li>${offer.offerLink}</li>`)
      .join('')}
</ul><p>Have a nice day!</p><p>BotHoliday</p>`;

    await this.transporter.sendEmail(user.email, 'New offers!', html);
  }
}
