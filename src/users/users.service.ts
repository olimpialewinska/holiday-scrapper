import { Injectable } from '@nestjs/common';
import { Users } from '../entities/User.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4 as uuidv4 } from 'uuid';
import { Preferences } from '../entities/Preferences.js';
import { Offer } from '../entities/Offer.js';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async findOne(email: string): Promise<Users | undefined> {
    try {
      return await this.em.findOne(Users, { email: email });
    } catch (error) {
      return null;
    }
  }

  async create(user: any): Promise<Users> {
    const newUser = new Users();
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

    pref.userId = user.id;
    pref.pricePerPerson = preferences.pricePerPerson;

    await this.em.persistAndFlush(pref);
    return pref;
  }

  async getPreferences(email: string): Promise<Preferences> {
    return await this.em.findOne(Preferences, {
      userId: (await this.findOne(email)).id,
    });
  }

  async getAllOffers() {
    return await this.em.find(Offer, {});
  }
}
