import { PrismaService } from '../prisma/prisma.service';
export declare class MerchantsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(ownerId: string, data: any): Promise<{
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
    }>;
    me(ownerId: string): Promise<{
        kyc: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            merchantId: string;
            status: import("@prisma/client").$Enums.KycStatus;
            documentUrl: string | null;
            notes: string | null;
        } | null;
        payout: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            merchantId: string;
            method: string;
            accountRef: string;
        } | null;
        owner: {
            id: string;
            name: string | null;
            phone: string | null;
            email: string;
        };
    } & {
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
    }>;
    update(ownerId: string, data: any): Promise<{
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
    }>;
    nearby(lat: number, lon: number, radiusKm?: number): Promise<{
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
    summary(ownerId: string): Promise<{
        totalSalesETB: number;
        itemsSold: number;
    }>;
    getMerchants(params: any): Promise<{
        merchants: ({
            kyc: {
                status: import("@prisma/client").$Enums.KycStatus;
            } | null;
            owner: {
                id: string;
                name: string | null;
                phone: string | null;
            };
        } & {
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
        })[];
        total: number;
        page: any;
        limit: any;
        totalPages: number;
    }>;
    searchNearbyMerchants(lat: number, lon: number, radius: number): Promise<{
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
    getMerchant(id: string): Promise<{
        kyc: {
            status: import("@prisma/client").$Enums.KycStatus;
        } | null;
        owner: {
            id: string;
            name: string | null;
            phone: string | null;
        };
    } & {
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
    }>;
    getMerchantProducts(merchantId: string, params: any): Promise<{
        products: ({
            category: {
                id: string;
                name: string;
            } | null;
            skus: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                unitType: import("@prisma/client").$Enums.UnitType;
                unitIncrement: number;
                packageSize: number | null;
                pricePerCanonicalUnit: number;
                currency: string;
                active: boolean;
                productId: string;
            }[];
        } & {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            images: string[];
            merchantId: string;
            categoryId: string | null;
        })[];
        total: number;
        page: any;
        limit: any;
        totalPages: number;
    }>;
    getMerchantOrders(merchantId: string, params: any): Promise<{
        orders: ({
            user: {
                id: string;
                name: string | null;
                phone: string | null;
            };
            items: ({
                sku: {
                    product: {
                        name: string;
                    };
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    unitType: import("@prisma/client").$Enums.UnitType;
                    unitIncrement: number;
                    packageSize: number | null;
                    pricePerCanonicalUnit: number;
                    currency: string;
                    active: boolean;
                    productId: string;
                };
            } & {
                id: string;
                orderId: string;
                skuId: string;
                requestedQty: number;
                settledQty: number | null;
                unitPrice: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            merchantId: string;
            currency: string;
            userId: string;
            totalAmount: number;
            addressId: string | null;
            status: import("@prisma/client").$Enums.OrderStatus;
        })[];
        total: number;
        page: any;
        limit: any;
        totalPages: number;
    }>;
    getMerchantSummary(merchantId: string): Promise<{
        totalSalesETB: number;
        itemsSold: number;
        productCount: number;
        rating: number;
    }>;
    getCurrentMerchant(ownerId: string): Promise<{
        kyc: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            merchantId: string;
            status: import("@prisma/client").$Enums.KycStatus;
            documentUrl: string | null;
            notes: string | null;
        } | null;
        payout: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            merchantId: string;
            method: string;
            accountRef: string;
        } | null;
        owner: {
            id: string;
            name: string | null;
            phone: string | null;
            email: string;
        };
    } & {
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
    }>;
    createMerchant(ownerId: string, data: any): Promise<{
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
    }>;
    updateMerchant(ownerId: string, id: string, data: any): Promise<{
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
    }>;
    deleteMerchant(ownerId: string, id: string): Promise<{
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
    }>;
    approveMerchant(ownerId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        documentUrl: string | null;
        notes: string | null;
    }>;
    rejectMerchant(ownerId: string, id: string, reason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        documentUrl: string | null;
        notes: string | null;
    }>;
}
