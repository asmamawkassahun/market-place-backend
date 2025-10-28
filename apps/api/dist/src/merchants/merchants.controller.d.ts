import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
export declare class MerchantsController {
    private readonly service;
    constructor(service: MerchantsService);
    getMerchants(page?: number, limit?: number, search?: string, isActive?: boolean, isVerified?: boolean, lat?: number, lon?: number, radius?: number, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
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
    searchNearbyMerchants(lat: number, lon: number, radius?: number): Promise<{
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
    getMerchantProducts(merchantId: string, page?: number, limit?: number, category?: string, search?: string): Promise<{
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
    getMerchantOrders(merchantId: string, page?: number, limit?: number, status?: string): Promise<{
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
    getCurrentMerchant(user: any): Promise<{
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
    createMerchant(user: any, body: CreateMerchantDto): Promise<{
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
    updateMerchant(user: any, id: string, body: any): Promise<{
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
    deleteMerchant(user: any, id: string): Promise<{
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
    approveMerchant(user: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        documentUrl: string | null;
        notes: string | null;
    }>;
    rejectMerchant(user: any, id: string, body: {
        reason?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        documentUrl: string | null;
        notes: string | null;
    }>;
    update(user: any, body: any): Promise<{
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
    summary(user: any): Promise<{
        totalSalesETB: number;
        itemsSold: number;
    }>;
    nearby(body: {
        lat: number;
        lon: number;
        radiusKm?: number;
    }): Promise<{
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
