import { PrismaService } from '../prisma/prisma.service';
export declare class WebhooksService {
    private prisma;
    constructor(prisma: PrismaService);
    accept(provider: 'telebirr' | 'chapa' | 'amole', payload: any): Promise<{
        ok: boolean;
    }>;
}
