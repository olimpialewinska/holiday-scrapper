import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PreferencesService } from './preferences.service.js';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async addPreferences(@Request() req) {
    return await this.preferencesService.addPreferences(
      req.user.email,
      req.body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('getPreferences')
  async getPreferences(@Request() req) {
    return await this.preferencesService.getPreferences(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllOffers')
  async getAllOffers(@Request() req) {
    return await this.preferencesService.getAllOffers();
  }
}
