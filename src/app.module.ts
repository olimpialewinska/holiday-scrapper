import { Module } from '@nestjs/common';
import { ScrapperModule } from './scrapper/scrapper.module.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PreferencesModule } from './preferences/preferences.module.js';
import { MikroOrmConfigService } from './mikro-orm.config.js';
import { getEnvPath } from './common/env.helper.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    ScrapperModule,
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [MikroOrmConfigService, ConfigService],
      useClass: MikroOrmConfigService,
    }),
    UsersModule,
    AuthModule,
    PreferencesModule,
  ],
})
export class AppModule {}
