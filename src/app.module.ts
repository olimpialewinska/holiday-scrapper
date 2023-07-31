import { Module } from '@nestjs/common';
import { ScrapperModule } from './scrapper/scrapper.module.js';

@Module({
  imports: [ScrapperModule],
})
export class AppModule {}
