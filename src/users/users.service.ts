import { Injectable } from '@nestjs/common';
import { User } from '../entities/User.js';
import { EntityManager } from '@mikro-orm/postgresql';

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
}
