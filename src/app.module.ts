import { Module } from '@nestjs/common';
import { ScrapperModule } from './scrapper/scrapper.module.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroOrmConfigService } from './mikro-orm.config.js';
import { User } from './entities/User.js';
import { Preferences } from './entities/Preferences.js';
import { Offer } from './entities/Offer.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ScrapperModule,
    MikroOrmModule.forRootAsync({
      useClass: MikroOrmConfigService,
    }),
    MikroOrmModule.forFeature([User, Preferences, Offer]),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
