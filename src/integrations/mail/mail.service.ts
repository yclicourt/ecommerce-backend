import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
    return transporter;
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetUrl: string,
  ): Promise<void> {
    const transport = this.emailTransport();
    const mailOptions = {
      from: `"Ecommerce Yoyo's Shop" <${this.configService.get<string>('SMTP_FROM_EMAIL')}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };
    try {
      const info = await transport.sendMail(mailOptions);
      console.log('Email enviado:', info.messageId, info.response);
    } catch (error) {
      console.error('Error al enviar email:', error);
      throw new Error('Failed to send email');
    }
  }
}
