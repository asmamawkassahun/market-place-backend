import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import { randomBytes, createHash } from 'crypto';

function hashSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, 
    private jwt: JwtService,
    private smsService: SmsService
  ) {}

  async requestOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`[AuthService] Starting requestOtp for email: ${email}`);
      
      // Gmail SMTP allows sending to any email address
      
      // Generate OTP
      const otp = this.smsService.generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      console.log(`[AuthService] Generated OTP: ${otp}`);

      // Create or update user first
      console.log(`[AuthService] Creating/updating user...`);
      const user = await this.prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, phone: null, role: 'USER' },
      });
      console.log(`[AuthService] User ready: ${user.id}`);

      // Clean up old OTPs for this email
      console.log(`[AuthService] Cleaning up old OTPs...`);
      const deletedCount = await this.prisma.otp.deleteMany({
        where: { 
          email: email,
          OR: [
            { expiresAt: { lt: new Date() } },
            { used: true }
          ]
        }
      });
      console.log(`[AuthService] Deleted ${deletedCount.count} old OTPs`);

      // Create new OTP record
      console.log(`[AuthService] Creating new OTP record...`);
      const otpRecord = await this.prisma.otp.create({
        data: {
          email: email,
          code: otp,
          expiresAt
        }
      });
      console.log(`[AuthService] OTP record created: ${otpRecord.id}`);

      // Send OTP via Email
      console.log(`[AuthService] Sending OTP via email...`);
      const emailSent = await this.smsService.sendOtp(email, otp);
      console.log(`[AuthService] Email send result: ${emailSent}`);
      
      if (!emailSent) {
        throw new Error('Failed to send email');
      }

      console.log(`[AuthService] OTP request successful`);
      return { 
        success: true, 
        message: 'OTP sent successfully to your email' 
      };
    } catch (error) {
      console.error(`[AuthService] Error in requestOtp:`, error);
      console.error(`[AuthService] Error stack:`, error.stack);
      throw new BadRequestException('Failed to send OTP. Please try again.');
    }
  }

  private async issueAccessToken(user: { id: string; role: string; email: string }) {
    const payload = { sub: user.id, role: user.role, email: user.email };
    return this.jwt.signAsync(payload);
  }

  private async issueRefreshToken(userId: string) {
    const tokenId = randomBytes(16).toString('hex');
    const secret = randomBytes(32).toString('hex');
    const secretHash = hashSecret(secret);
    const ttlDays = Number(process.env.REFRESH_TTL_DAYS || 30);
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    await this.prisma.createRefreshToken({ userId, tokenId, secretHash, expiresAt });
    return { tokenId, secret };
  }

  async verifyOtp(email: string, code: string): Promise<{ access_token: string; refresh_token: string; user: any }> {
    // Find valid OTP
    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        email: email,
        code,
        used: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.prisma.otp.update({
      where: { id: otpRecord.id },
      data: { used: true }
    });

    // Get or create user
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate tokens
    const access_token = await this.issueAccessToken(user as any);
    const rt = await this.issueRefreshToken(user.id);
    const refresh_token = `${rt.tokenId}.${rt.secret}`;

    return { 
      access_token, 
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role
      }
    };
  }

  async refreshTokens(compound: string) {
    const [tokenId, secret] = (compound || '').split('.');
    if (!tokenId || !secret) throw new UnauthorizedException('Invalid refresh token');
    const record = await this.prisma.findRefreshTokenByTokenId(tokenId);
    if (!record || record.revokedAt || record.expiresAt < new Date()) throw new UnauthorizedException('Invalid refresh token');
    if (record.secretHash !== hashSecret(secret)) throw new UnauthorizedException('Invalid refresh token');
    const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) throw new UnauthorizedException('User not found');
    await this.prisma.revokeRefreshTokenByTokenId(tokenId, new Date());
    const access_token = await this.issueAccessToken(user as any);
    const rt = await this.issueRefreshToken(user.id);
    const refresh_token = `${rt.tokenId}.${rt.secret}`;
    return { access_token, refresh_token };
  }

  async revokeRefreshToken(compound: string) {
    const [tokenId] = (compound || '').split('.');
    if (!tokenId) return { ok: true };
    await this.prisma.revokeRefreshTokenByTokenId(tokenId, new Date()).catch(() => undefined);
    return { ok: true };
  }

}


