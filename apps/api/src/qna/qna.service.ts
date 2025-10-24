import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QnaService {
  constructor(private prisma: PrismaService) {}

  ask(userId: string, productId: string, question: string) {
    return this.prisma.qna.create({ data: { userId, productId, question } });
  }

  answer(qnaId: string, answer: string) {
    return this.prisma.qna.update({ where: { id: qnaId }, data: { answer, answeredAt: new Date() } });
  }

  list(productId: string) { return this.prisma.qna.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } }); }
}


