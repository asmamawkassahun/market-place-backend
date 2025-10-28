import { GeoService } from './geo.service';
export declare class GeoController {
    private readonly service;
    constructor(service: GeoService);
    nearby(lat: string, lon: string, radiusKm?: string): Promise<{
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
