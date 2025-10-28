import { PrismaService } from '../prisma/prisma.service';
export declare class GeoService {
    private prisma;
    constructor(prisma: PrismaService);
    nearbyMerchants(lat: number, lon: number, radiusKm?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        legalName: string | null;
        description: string | null;
        logoUrl: string | null;
        rating: number;
        lat: number | null;
        lon: number | null;
        serviceAreas: string[];
        ownerId: string;
    }[]>;
}
