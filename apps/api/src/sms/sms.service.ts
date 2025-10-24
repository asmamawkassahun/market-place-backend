import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const gmailUser = this.configService.get<string>('GMAIL_USER');
    const gmailAppPassword = this.configService.get<string>('GMAIL_APP_PASSWORD');
    
    if (gmailUser && gmailAppPassword) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword
        }
      });
      this.logger.log('Gmail SMTP transporter initialized');
    } else {
      this.logger.warn('Gmail credentials not configured, falling back to console logging');
    }
  }

  async sendOtp(email: string, otp: string): Promise<boolean> {
    try {
      // Try to send via Gmail SMTP if configured
      if (this.transporter) {
        const emailSent = await this.sendOtpViaGmail(email, otp);
        if (emailSent) {
          return true;
        }
        // If Gmail fails, fall back to console logging
        this.logger.warn('Gmail SMTP failed, falling back to console logging');
      }
      
      // Fallback: Console logging for development
      console.log(`\n📧 ==========================================`);
      console.log(`📧 EMAIL OTP VERIFICATION`);
      console.log(`📧 ==========================================`);
      console.log(`📧 Email: ${email}`);
      console.log(`📧 OTP Code: ${otp}`);
      console.log(`📧 Expires in: 10 minutes`);
      console.log(`📧 ==========================================\n`);
      
      return true;
    } catch (error) {
      console.error(`[SmsService] Error in sendOtp:`, error);
      return false;
    }
  }

  private async sendOtpViaGmail(email: string, otp: string): Promise<boolean> {
    try {
      const gmailUser = this.configService.get<string>('GMAIL_USER');
      
      const mailOptions = {
        from: gmailUser,
        to: email,
        subject: 'Your OTP Verification Code - MAJET E-commerce',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">MAJET E-commerce</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">OTP Verification</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
              <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Hello! You requested a verification code for your account. Use the code below to complete your verification:
              </p>
              
              <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: 'Courier New', monospace;">${otp}</span>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                <strong>Important:</strong> This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>This is an automated message from MAJET E-commerce, please do not reply.</p>
            </div>
          </div>
        `,
        text: `MAJET E-commerce - OTP Verification\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nBest regards,\nMAJET E-commerce Team`
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`[GMAIL] OTP email sent successfully to ${email}: ${otp}`);
      console.log(`\n📧 Email sent successfully to ${email}! OTP: ${otp}\n`);
      console.log(`📧 Message ID: ${result.messageId}\n`);
      
      return true;
    } catch (error) {
      this.logger.error('Failed to send OTP via Gmail:', error);
      console.log(`\n❌ Gmail Error: ${error.message}\n`);
      return false;
    }
  }


  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
