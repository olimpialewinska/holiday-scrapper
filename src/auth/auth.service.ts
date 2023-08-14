import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import e from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    if (user.emailVerified === false) {
      return { message: 'Email not verified.' };
    }
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: any) {
    const data = await this.usersService.findOne(user.email);
    if (data !== null) {
      return { error: 'User already exist' };
    }
    return this.usersService.create(user);
  }

  async confirmEmail(email: string): Promise<boolean> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      return false;
    }

    user.emailVerified = true;
    await this.usersService.update(user);
    return true;
  }

  async isEmailConfirmed(email: string): Promise<boolean> {
    const user = await this.usersService.findOne(email);
    return user?.emailVerified || false;
  }

  async changePassword(email: string, password: string) {
    return this.usersService.changePassword(email, password);
  }
}
