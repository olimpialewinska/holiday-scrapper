import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ScrapperService } from './scrapper/scrapper-service.js';
import { MikroORM } from '@mikro-orm/postgresql';
import { MikroOrmConfigService } from './mikro-orm.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const ormConfigFactory = app.get(MikroOrmConfigService);
  const ormConfig = ormConfigFactory.createMikroOrmOptions();

  const orm = await MikroORM.init(ormConfig);
  await orm.getMigrator().up();
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();

  const service = app.get(ScrapperService);
  await service.startScheduledScraping();
}
bootstrap();
