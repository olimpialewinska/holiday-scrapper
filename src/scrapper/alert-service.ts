import { EntityManager } from '@mikro-orm/postgresql';
import { Users } from '../entities/User.js';
import { IPriceChange, Item } from './common.js';
import { Preferences } from '../entities/Preferences.js';
import { createTqdm } from '../utils/threads/tqdm.js';
import { limitedArrayMap } from '../utils/threads/threads.js';
import { NodemailerService } from '../utils/nodemailer-config.js';
import { Injectable } from '@nestjs/common';

interface IAlertService {
  newOffers: Item[];
  updatedOffers: IPriceChange[];
}

@Injectable()
export class AlertService {
  constructor(
    private readonly em: EntityManager,
    private readonly transporter: NodemailerService,
  ) {}

  public async sendOffers(offers: IAlertService): Promise<void> {
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
        const matchingOffersUpdated: IPriceChange[] = [];

        offers.newOffers.forEach((offer: Item) => {
          const durationMach = !userPreferences.duration
            ? true
            : this.matchDuration(
                userPreferences.duration,
                this.countDuration(offer.startDate, offer.endDate),
              );
          if (
            offer.pricePerPerson <= userPreferences.pricePerPerson &&
            offer.rating >= userPreferences.rating &&
            (userPreferences.destination.length === 0 ||
              userPreferences.destination.includes(offer.countryCode)) &&
            (userPreferences.mealType.length === 0 ||
              userPreferences.mealType.includes(offer.mealShort)) &&
            durationMach
          ) {
            matchingOffers.push(offer);
          }
        });

        offers.updatedOffers.forEach((offer: IPriceChange) => {
          if (
            offer.newPrice <= userPreferences.pricePerPerson &&
            offer.oldOffer.rating >= userPreferences.rating
          ) {
            matchingOffersUpdated.push();
          }
        });

        if (matchingOffers.length > 0) {
          this.sendEmailToUser(user, matchingOffers, matchingOffersUpdated);
        }
      }),
    );
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

  async getAllUsers(): Promise<Users[]> {
    const userRepository = this.em.getRepository(Users);
    const users = await userRepository.findAll();

    return users;
  }

  private async getPreferences(userId: number) {
    return await this.em.findOne(Preferences, { userId: userId });
  }

  private async sendEmailToUser(
    user: Users,
    offers: Item[],
    updatedOffers: IPriceChange[],
  ): Promise<void> {
    const cssStyles = `
    <style>
      body {
        font-family: "Roboto", sans-serif;
        font-size: 16px;
      }
      .bg {
        align-items: center;
      }
      .wrapper {
        margin-top: 20px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        padding: 10px;
      }
      .title {
        font-size: 20px;
        font-weight: bold;
      }
      .btn {
        background-color: #4caf50;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 12px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 10px;
        transition: 0.3s all;
        color: white;
      }
      .btn:hover {
        background-color: #3e8e41;
      }
      .red {
        color: red;
      }
    </style>
  `;

    const matchedOffersHTML = offers
      .map(
        (offer) => `
        <div class="wrapper">
        <img src="${offer.image}" alt="offer image" width="200" height="200">
          <div class="title">${offer.title}</div>
          <div>Destination: ${offer.destination}</div>
          <div>Price: ${offer.pricePerPerson}zł</div>
          <div>Rating: ${offer.rating ? '⭐️'.repeat(offer.rating) : 0}</div>
          <a href="${offer.offerLink}" class="btn">Go to offer</a>
        </div>
      `,
      )
      .join('');

    const updatedOffersHTML = updatedOffers
      .map(
        (offer) => ` <div class="wrapper">
        <img src="${
          offer.oldOffer.image
        }" alt="offer image" width="200" height="200">
          <div class="title">${offer.oldOffer.title}</div>
          <div>Destination: ${offer.oldOffer.destination}</div>
          <div>Price:<p class="red"> ${offer.oldOffer.pricePerPerson}zł<p> ${
          ' ' + offer.newPrice
        } zł </p></p></div>
          <div>Rating: ${
            offer.oldOffer.rating ? '⭐️'.repeat(offer.oldOffer.rating) : 0
          }</div>
          <a href="${offer.oldOffer.offerLink}" class="btn">Go to offer</a>
        </div>`,
      )
      .join('');

    const html = `
    <html>
      <head>
        <title>New Offers!</title>
        ${cssStyles}
      </head>
      <body>
        <h1>Hi ${user.email.split('@')[0]}!</h1> 
        <p>Here are some offers that match your preferences:</p>
        <div class="bg">${matchedOffersHTML}</div>
        ${
          updatedOffers.length > 0
            ? '<p>Here are some offers that have changed:</p>'
            : ''
        }
        <ul>${updatedOffersHTML}</ul>
        <p>Have a nice day!</p>
        <p>BotHoliday</p>
      </body>
    </html>
  `;

    await this.transporter.sendEmail(user.email, 'New offers!', html);
  }
}
