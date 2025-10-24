import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestEmailOtpDto, VerifyEmailOtpDto } from './dto/email-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @HttpCode(200)
  async requestOtp(@Body() body: RequestEmailOtpDto) {
    const result = await this.authService.requestOtp(body.email);
    return result;
  }

  @Post('verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() body: VerifyEmailOtpDto, @Res({ passthrough: true }) res: any) {
    const { access_token, refresh_token, user } = await this.authService.verifyOtp(body.email, body.code);
    const secure = process.env.NODE_ENV !== 'development';
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure,
      sameSite: secure ? 'lax' : 'lax',
      path: '/api/auth',
      maxAge: Number(process.env.REFRESH_TTL_DAYS || 30) * 24 * 60 * 60 * 1000,
    });
    return { 
      access_token,
      user,
      success: true,
      message: 'Login successful'
    };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const rt = req.cookies?.refresh_token;
    const { access_token, refresh_token } = await this.authService.refreshTokens(rt);
    const secure = process.env.NODE_ENV !== 'development';
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure,
      sameSite: secure ? 'lax' : 'lax',
      path: '/api/auth',
      maxAge: Number(process.env.REFRESH_TTL_DAYS || 30) * 24 * 60 * 60 * 1000,
    });
    return { access_token };
  }

  @Post('revoke')
  @HttpCode(200)
  async revoke(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const rt = req.cookies?.refresh_token;
    if (rt) await this.authService.revokeRefreshToken(rt);
    res.clearCookie('refresh_token', { path: '/api/auth' });
    return { ok: true };
  }

}


