import { Injectable } from '@nestjs/common';
import { Users } from '../entities/User.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { Preferences } from '../entities/Preferences.js';
import { Offer } from '../entities/Offer.js';
import { NodemailerService } from '../utils/nodemailer-config.js';
import { ISearchQuery } from 'src/common/ISearchQuery.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    private readonly mailer: NodemailerService,
  ) {}

  async findOne(email: string): Promise<Users | undefined> {
    try {
      return await this.em.findOne(Users, { email: email });
    } catch (error) {
      return null;
    }
  }
  async checkIfExist(
    email: string,
    password: string,
  ): Promise<Users | undefined> {
    try {
      return await this.em.findOne(Users, { email: email, password: password });
    } catch (error) {
      return null;
    }
  }

  async changePassword(email: string, password: string) {
    const user = await this.findOne(email);
    user.password = password;
    await this.em.persistAndFlush(user);
  }

  async create(user: any) {
    try {
      const newUser = new Users();
      newUser.email = user.email;
      newUser.password = user.password;
      await this.em.persistAndFlush(newUser);
      const html = `<h1>BotHoliday - Email Confirmation</h1>
    <p>Thank you for registering on our website.</p>
    <p> Your account has been created. You can log in using the following credentials:</p>
    <p>Username: ${newUser.email}</p>
    <p>Password: ${newUser.password}</p>
    <p>Confirm your email address by clicking on the link below:</p>
    <a href="http://localhost:3000/auth/confirm/${newUser.email}">Confirm email</a>
    <p>Have a nice day!</p>
    <p>BotHoliday</p>`;
      await this.mailer.sendEmail(
        newUser.email,
        'BotHoliday - Email Confirmation',
        html,
      );
      return newUser;
    } catch {
      return { error: 'Something went wrong' };
    }
  }

  async addPreferences(
    email: string,
    preferences: Preferences,
  ): Promise<Preferences> {
    const user = await this.findOne(email);

    let pref = new Preferences();

    pref.userId = user.id;
    pref.pricePerPerson = preferences.pricePerPerson;

    await this.em.persistAndFlush(pref);
    return pref;
  }

  async getPreferences(email: string) {
    const preferences = await this.em.findOne(Preferences, {
      userId: (await this.findOne(email)).id,
    });
    if (!preferences) {
      return null;
    }

    return {
      destination: preferences.destination,
      mealType: preferences.mealType,
      duration: preferences.duration,
      rating: preferences.rating,
      price: preferences.pricePerPerson,
    };
  }

  async getAllOffers() {
    return await this.em.find(
      Offer,
      {},
      { orderBy: { pricePerPerson: 'ASC' } },
    );
  }

  async update(user: Users) {
    await this.em.persistAndFlush(user);
  }

  async getOffers(data: ISearchQuery) {
    const filters: any = {};
    let sort: any = {};

    if (data.destination) {
      filters.destination = { $ilike: `%${data.destination}%` };
    }

    if (data.maxPrice) {
      filters.pricePerPerson = { $lt: data.maxPrice };
    }

    if (data.stars) {
      filters.rating = { $gte: data.stars };
    }

    if (data.startDate) {
      filters.startDate = data.startDate;
    }

    if (data.endDate) {
      filters.endDate = data.endDate;
    }

    if (data.nutrition) {
      filters.mealType = { $like: `%${data.nutrition}%` };
    }

    if (data.sort === 'asc') {
      sort = { orderBy: { pricePerPerson: 'ASC' } };
    } else if (data.sort === 'desc') {
      sort = { orderBy: { pricePerPerson: 'DESC' } };
    } else {
      sort = { orderBy: { rating: 'DESC' } };
    }

    const offers = await this.em.find(Offer, filters, sort);

    return offers;
  }
}
