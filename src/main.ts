import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ScrapperService } from './scrapper/scrapper-service.js';
import { transporter } from './utils/nodemailer-config.js';
import { MikroORM } from '@mikro-orm/postgresql';
import mikroOrmConfig from './mikro-orm.config.js';

// const mailOptions = {
//   from: 'botholiday1@gmail.com',
//   to: 'olim1003@gmail.com',
//   subject: 'Subject',
//   html: '<h1>Email content</h1>',
// };

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up;

  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
  // const service = app.get(ScrapperService);
  // await service.startScheduledScraping();
  // await transporter.sendMail(mailOptions);
}
bootstrap();
