import { INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit(): Promise<void>;
    enableShutdownHooks(app: INestApplication): Promise<void>;
    createRefreshToken(data: {
        userId: string;
        tokenId: string;
        secretHash: string;
        expiresAt: Date;
    }): Promise<any>;
    findRefreshTokenByTokenId(tokenId: string): Promise<any>;
    revokeRefreshTokenByTokenId(tokenId: string, revokedAt: Date): Promise<any>;
}
