import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { NodemailerService } from '../utils/nodemailer-config.js';

@Module({
  providers: [UsersService, NodemailerService],
  exports: [UsersService],
})
export class UsersModule {}
