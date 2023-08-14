import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  constructor(private readonly config: ConfigService) {}

  private createTransporter() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      auth: {
        type: 'OAuth2',
        user: this.config.get('EMAIL_USER'),
        clientId: this.config.get('OAUTH_CLIENT_ID'),
        clientSecret: this.config.get('OAUTH_CLIENT_SECRET'),
        refreshToken: this.config.get('OAUTH_REFRESH_TOKEN'),
      },
    });
  }

  public async sendEmail(email: string, subject: string, html: string) {
    const transporter = this.createTransporter();

    const mailOptions = {
      from: this.config.get('EMAIL_USER'),
      to: email,
      subject: subject,
      html: html,
    };
    await transporter.sendMail(mailOptions);
  }
}
