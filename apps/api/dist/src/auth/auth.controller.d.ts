import { AuthService } from './auth.service';
import { RequestEmailOtpDto, VerifyEmailOtpDto } from './dto/email-otp.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    requestOtp(body: RequestEmailOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(body: VerifyEmailOtpDto, res: any): Promise<{
        access_token: string;
        user: any;
        success: boolean;
        message: string;
    }>;
    refresh(req: any, res: any): Promise<{
        access_token: string;
    }>;
    revoke(req: any, res: any): Promise<{
        ok: boolean;
    }>;
}
