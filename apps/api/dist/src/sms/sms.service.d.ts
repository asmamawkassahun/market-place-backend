import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private initializeTransporter;
    sendOtp(email: string, otp: string): Promise<boolean>;
    private sendOtpViaGmail;
    generateOtp(): string;
}
