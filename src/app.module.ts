import { Module } from '@nestjs/common';
import { ScrapperModule } from './scrapper/scrapper.module.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroOrmConfigService } from './mikro-orm.config.js';
import { User } from './entities/User.js';
import { Preferences } from './entities/Preferences.js';

@Module({
  imports: [
    ScrapperModule,
    MikroOrmModule.forRootAsync({
      useClass: MikroOrmConfigService,
    }),
    MikroOrmModule.forFeature([User, Preferences]),
  ],
})
export class AppModule {}
