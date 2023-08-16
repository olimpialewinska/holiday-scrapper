import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PreferencesService } from './preferences.service.js';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('addPreferences')
  async addPreferences(@Request() req) {
    return await this.preferencesService.addPreferences(
      req.body.email,
      req.body.preferences,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('getPreferences')
  async getPreferences(@Request() req) {
    return await this.preferencesService.getPreferences(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllOffers')
  async getAllOffers() {
    return await this.preferencesService.getAllOffers();
  }
}
