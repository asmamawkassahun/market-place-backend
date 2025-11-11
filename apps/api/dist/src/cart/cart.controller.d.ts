import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
export declare class CartController {
    private readonly service;
    constructor(service: CartService);
    list(user: any): Promise<{
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
    add(user: any, body: AddCartItemDto): Promise<{
        id: string;
        quantity: number;
        skuId: string;
        unitPrice: number;
        cartId: string;
    }>;
    update(user: any, itemId: string, body: {
        quantity: number;
    }): Promise<{
        id: string;
        quantity: number;
        skuId: string;
        unitPrice: number;
        cartId: string;
    }>;
    remove(user: any, itemId: string): Promise<{
        id: string;
        quantity: number;
        skuId: string;
        unitPrice: number;
        cartId: string;
    }>;
    clear(user: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    count(user: any): Promise<{
        count: number;
    }>;
}
