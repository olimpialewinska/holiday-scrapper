import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ScrapperService } from './scrapper/scrapper-service.js';
import { transporter } from './utils/nodemailer-config.js';

const mailOptions = {
  from: 'botholiday1@gmail.com',
  to: 'olim1003@gmail.com',
  subject: 'Subject',
  text: 'Email content',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // const service = app.get(ScrapperService);
  // await service.startScheduledScraping();
  // await transporter.sendMail(mailOptions);
}
bootstrap();
