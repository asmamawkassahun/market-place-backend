import { PrismaService } from '../prisma/prisma.service';
export declare class ChatCleanup {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    pruneMessages(): Promise<void>;
}
