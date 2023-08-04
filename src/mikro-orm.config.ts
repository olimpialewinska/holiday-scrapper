import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

import { Injectable } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import { User } from './entities/User.js';
import { Preferences } from './entities/Preferences.js';

@Injectable()
export class MikroOrmConfigService {
  createMikroOrmOptions(): Options {
    return {
      entities: [User, Preferences],
      type: 'postgresql',
      dbName: 'postgres',
      user: 'postgres',
      password: 'xdxdxd',
      host: 'localhost',
      port: 5432,
      entitiesTs: ['./src/entities'],
      debug: true,
    };
  }
}
