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

  async findPreferences(userId: number): Promise<Preferences | undefined> {
    try {
      return await this.em.findOne(Preferences, { userId: userId });
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

    if (!user) {
      return null;
    }

    const pref = await this.findPreferences(user.id);

    if (pref) {
      pref.destination = preferences.destination;
      pref.duration = preferences.duration;
      pref.mealType = preferences.mealType;
      pref.rating = preferences.rating;
      pref.pricePerPerson = preferences.pricePerPerson;
      await this.em.persistAndFlush(pref);
      return pref;
    }

    let newPref = new Preferences();
    newPref.userId = user.id;
    newPref.destination = preferences.destination;
    newPref.duration = preferences.duration;
    newPref.mealType = preferences.mealType;
    newPref.rating = preferences.rating;
    newPref.pricePerPerson = preferences.pricePerPerson;

    await this.em.persistAndFlush(newPref);
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

  async update(user: Users) {
    await this.em.persistAndFlush(user);
  }
}
