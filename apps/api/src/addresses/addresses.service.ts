import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.address.create({ data: { ...data, userId } });
  }

  async list(userId: string) {
    return this.prisma.address.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async update(userId: string, id: string, data: any) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) throw new NotFoundException('Address not found');
    return this.prisma.address.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) throw new NotFoundException('Address not found');
    return this.prisma.address.delete({ where: { id } });
  }
}


