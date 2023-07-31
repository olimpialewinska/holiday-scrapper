import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ScrapperService } from './scrapper/scrapper-service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const service = app.get(ScrapperService);
  await service.run();
}
bootstrap();
