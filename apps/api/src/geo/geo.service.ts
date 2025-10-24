import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeoService {
  constructor(private prisma: PrismaService) {}

  async nearbyMerchants(lat: number, lon: number, radiusKm = 25) {
    const all = await this.prisma.merchant.findMany({ where: { lat: { not: null }, lon: { not: null } } });
    const R = 6371; const toRad = (d: number) => (d * Math.PI) / 180;
    return all.filter((m) => {
      if (m.lat == null || m.lon == null) return false;
      const dLat = toRad((m.lat as number) - lat);
      const dLon = toRad((m.lon as number) - lon);
      const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat))*Math.cos(toRad(m.lat as number))*Math.sin(dLon/2)**2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c <= radiusKm;
    });
  }
}


