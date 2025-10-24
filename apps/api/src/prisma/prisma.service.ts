import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[Prisma] Database connection failed. API will start but DB calls will fail until resolved.', e);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('beforeExit' as any, async () => {
      await app.close();
    });
  }

  // Refresh token helpers (use any to avoid type lag between migrations and client regen)
  async createRefreshToken(data: { userId: string; tokenId: string; secretHash: string; expiresAt: Date }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this as any).refreshToken.create({ data });
  }

  async findRefreshTokenByTokenId(tokenId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this as any).refreshToken.findUnique({ where: { tokenId } });
  }

  async revokeRefreshTokenByTokenId(tokenId: string, revokedAt: Date) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this as any).refreshToken.update({ where: { tokenId }, data: { revokedAt } });
  }
}


