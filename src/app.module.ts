import { Module } from '@nestjs/common';
import { ScrapperModule } from './scrapper/scrapper.module.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import MikroOrmConfigService from './mikro-orm.config.js';
import { User } from './entities/User.js';
import { Preferences } from './entities/Preferences.js';
import { Offer } from './entities/Offer.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PreferencesModule } from './preferences/preferences.module.js';
import mikroOrmConfig from './mikro-orm.config.js';

@Module({
  imports: [
    ScrapperModule,
    // MikroOrmModule.forRootAsync({
    //   useClass: MikroOrmConfigService,
    // }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature([User, Preferences, Offer]),
    UsersModule,
    AuthModule,
    PreferencesModule,
  ],
})
export class AppModule {}
