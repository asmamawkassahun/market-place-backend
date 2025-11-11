import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreateCart(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addItem(userId: string, item: {
        skuId: string;
        quantity: number;
    }): Promise<{
        id: string;
        quantity: number;
        skuId: string;
        unitPrice: number;
        cartId: string;
    }>;
    list(userId: string): Promise<{
        items: ({
            sku: {
                product: {
                    merchant: {
                        id: string;
                        displayName: string;
                        logoUrl: string | null;
                    };
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
            quantity: number;
            skuId: string;
            unitPrice: number;
            cartId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    removeItem(userId: string, cartItemId: string): Promise<{
        id: string;
        quantity: number;
        skuId: string;
        unitPrice: number;
        cartId: string;
    }>;
    updateItem(userId: string, cartItemId: string, data: {
        quantity: number;
    }): Promise<{
        id: string;
        quantity: number;
        skuId: string;
        unitPrice: number;
        cartId: string;
    }>;
    clearCart(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getCartCount(userId: string): Promise<{
        count: number;
    }>;
}
