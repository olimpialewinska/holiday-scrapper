import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PreferencesService } from './preferences.service.js';
import { ISearchQuery } from 'src/common/ISearchQuery.js';

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

  // @UseGuards(JwtAuthGuard)
  @Get('getAllOffers')
  async getAllOffers() {
    return await this.preferencesService.getAllOffers();
  }

  @Get('offers')
  async getOffers(
    @Query('destination') destination: string | null,
    @Query('maxPrice') maxPrice: number | null,
    @Query('stars') stars: number | null,
    @Query('startDate') startDate: Date | null,
    @Query('endDate') endDate: Date | null,
    @Query('nutrition') nutrition: string | null,
    @Query('sort') sort: 'asc' | 'desc' | 'stars' | null,
  ) {
    const data: ISearchQuery = {
      destination,
      maxPrice,
      stars,
      startDate,
      endDate,
      nutrition,
      sort,
    };
    return this.preferencesService.getOffers(data);
  }
}
