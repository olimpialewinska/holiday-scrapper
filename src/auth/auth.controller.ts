import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('auth/register')
  async register(@Request() req) {
    return await this.authService.register(req.body);
  }

  @Get('auth/confirm/:email')
  async confirmEmail(@Param('email') userId: string) {
    const isConfirmed = await this.authService.confirmEmail(userId);

    if (isConfirmed) {
      return { message: 'Email confirmed successfully.' };
    } else {
      return { message: 'Email confirmation failed.' };
    }
  }
  @Post('auth/user/changePassword')
  async changePassword(email: string, newPassword: string) {
    return this.authService.changePassword(email, newPassword);
  }
}
