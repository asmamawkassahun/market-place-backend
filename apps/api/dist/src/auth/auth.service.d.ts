import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
export declare class AuthService {
    private prisma;
    private jwt;
    private smsService;
    constructor(prisma: PrismaService, jwt: JwtService, smsService: SmsService);
    requestOtp(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private issueAccessToken;
    private issueRefreshToken;
    verifyOtp(email: string, code: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>;
    refreshTokens(compound: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    revokeRefreshToken(compound: string): Promise<{
        ok: boolean;
    }>;
}
