import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

const mikroOrmConfig: MikroOrmModuleOptions = {
  type: 'postgresql',
  dbName: 'postgres',
  user: 'postgres',
  password: 'xdxdxd',
  host: 'localhost',
  port: 5432,
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  debug: true,
};

export default mikroOrmConfig;
