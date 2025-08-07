import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendVerificationEmail(email: string, token: string, hoTen: string) {
    const verificationUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/user/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác thực email - Anngon App',
      template: 'verification-email',
      context: {
        hoTen,
        verificationUrl,
      },
    });
  }

  async sendWelcomeEmail(email: string, hoTen: string) {
    const loginUrl = `${this.configService.get('FRONTEND_URL')}/user/login`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Chào mừng bạn đến với Anngon App',
      template: 'welcome-email',
      context: {
        name: hoTen,
        loginUrl,
      },
    });
  }
}