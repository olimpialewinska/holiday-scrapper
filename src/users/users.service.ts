import { Injectable } from '@nestjs/common';
import { User } from '../entities/User.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4 as uuidv4 } from 'uuid';
import { Preferences } from '../entities/Preferences.js';
import { Offer } from '../entities/Offer.js';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async findOne(email: string): Promise<User | undefined> {
    try {
      return await this.em.findOne(User, { email: email });
    } catch (error) {
      return null;
    }
  }

  async create(user: any): Promise<User> {
    const newUser = new User();
    newUser.email = user.email;
    newUser.password = user.password;
    await this.em.persistAndFlush(newUser);
    return newUser;
  }

  async addPreferences(
    email: string,
    preferences: Preferences,
  ): Promise<Preferences> {
    const user = await this.findOne(email);

    let pref = new Preferences();

    pref = preferences;

    pref.userId = user.id;
    pref.user = user;

    await this.em.persistAndFlush(pref);
    return pref;
  }

  async getPreferences(email: string): Promise<Preferences> {
    return await this.em.findOne(Preferences, {
      user: await this.findOne(email),
    });
  }

  async getAllOffers() {
    return await this.em.find(Offer, {});
  }
}
