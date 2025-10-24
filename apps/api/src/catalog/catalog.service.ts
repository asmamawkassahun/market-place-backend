import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  createCategory(data: { name: string; slug: string; parentId?: string }) {
    return this.prisma.category.create({ data });
  }
  listCategories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }
}


