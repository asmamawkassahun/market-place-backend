import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, productId: string, rating: number, comment?: string, images?: string[]) {
    return this.prisma.review.create({ data: { userId, productId, rating, comment, images: images ?? [] } });
  }

  list(productId: string) { return this.prisma.review.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } }); }
}


