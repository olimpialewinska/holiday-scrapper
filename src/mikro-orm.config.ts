import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Offer } from './entities/Offer.js';
import { Preferences } from './entities/Preferences.js';
import { User } from './entities/User.js';

const mikroOrmConfig: MikroOrmModuleOptions = {
  type: 'postgresql',
  dbName: 'postgres',
  user: 'postgres',
  password: 'xdxdxd',
  host: 'localhost',
  port: 5432,
  entities: ['./dist/entities/*.js'],
  entitiesTs: [Offer, Preferences, User],
  debug: true,
};

export default mikroOrmConfig;
