import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class PreferencesService {
  constructor(private usersService: UsersService) {}

  async addPreferences(email: string, preferences: any): Promise<any> {
    return await this.usersService.addPreferences(email, preferences);
  }

  async getPreferences(email: string): Promise<any> {
    return await this.usersService.getPreferences(email);
  }

  async getAllOffers(): Promise<any> {
    return await this.usersService.getAllOffers();
  }
}
