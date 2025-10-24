import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatCleanup {
  private readonly logger = new Logger(ChatCleanup.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async pruneMessages() {
    const retentionDays = Number(process.env.CHAT_RETENTION_DAYS || 90);
    const olderThan = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    const res = await this.prisma.message.deleteMany({ where: { createdAt: { lt: olderThan } } });
    this.logger.log(`Pruned ${res.count} messages older than ${retentionDays} days.`);
  }
}


