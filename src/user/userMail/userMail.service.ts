import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserMailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendOtpEmail(
    email: string,
    fullName: string,
    otp: string,
  ): Promise<void> {
    const senderEmail =
      this.configService.get<string>('MAIL_USER');

    await this.mailerService.sendMail({
      from: `"Non-Paid Patient Portal" <${senderEmail}>`,
      to: email,
      subject: 'Account Verification OTP',
      text: `Hello ${fullName}, your account verification OTP is ${otp}.`,
    });
  }

  async sendWelcomeEmail(
    email: string,
    fullName: string,
  ): Promise<void> {
    const senderEmail =
      this.configService.get<string>('MAIL_USER');

    await this.mailerService.sendMail({
      from: `"Non-Paid Patient Portal" <${senderEmail}>`,
      to: email,
      subject: 'Account Verified Successfully',
      text: `Hello ${fullName}, your Non-Paid Patient account has been verified successfully.`,
    });
  }

  async sendAppointmentEmail(
    email: string,
    fullName: string,
    doctorName: string,
    appointmentDate: string,
  ): Promise<void> {
    const senderEmail =
      this.configService.get<string>('MAIL_USER');

    await this.mailerService.sendMail({
      from: `"Non-Paid Patient Portal" <${senderEmail}>`,
      to: email,
      subject: 'Appointment Booking Confirmation',
      text: `Hello ${fullName}, your appointment with Dr. ${doctorName} has been booked for ${appointmentDate}.`,
    });
  }
}