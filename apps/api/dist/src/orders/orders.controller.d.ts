import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly service;
    constructor(service: OrdersService);
    getOrders(user: any, page?: number, limit?: number, status?: string, merchantId?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        orders: ({
            merchant: {
                id: string;
                displayName: string;
            };
            address: {
                fullName: string;
                line1: string;
                city: string;
            } | null;
            items: ({
                sku: {
                    product: {
                        name: string;
                        images: string[];
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
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                currency: string;
                status: import("@prisma/client").$Enums.PaymentStatus;
                orderId: string;
                provider: string;
                amount: number;
            }[];
            shipments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                otp: string | null;
                status: import("@prisma/client").$Enums.ShipmentStatus;
                orderId: string;
                carrier: string;
                trackingCode: string | null;
                proofPhotoUrl: string | null;
            }[];
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
    getOrder(user: any, id: string): Promise<{
        merchant: {
            id: string;
            displayName: string;
            rating: number;
        };
        address: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            lat: number | null;
            lon: number | null;
            label: string | null;
            fullName: string;
            line1: string;
            line2: string | null;
            city: string;
            region: string | null;
            country: string;
            postalCode: string | null;
            plusCode: string | null;
            landmark: string | null;
            userId: string | null;
        } | null;
        items: ({
            sku: {
                product: {
                    name: string;
                    images: string[];
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
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: string;
            amount: number;
        }[];
        shipments: ({
            events: {
                id: string;
                createdAt: Date;
                message: string | null;
                status: import("@prisma/client").$Enums.ShipmentStatus;
                shipmentId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            otp: string | null;
            status: import("@prisma/client").$Enums.ShipmentStatus;
            orderId: string;
            carrier: string;
            trackingCode: string | null;
            proofPhotoUrl: string | null;
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
    }>;
    createOrder(user: any, body: any): Promise<void>;
    createFromCart(user: any, body: {
        addressId: string;
        paymentProvider: string;
    }): Promise<{
        orderId: string;
        paymentId: string;
    }>;
    updateOrder(user: any, id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        currency: string;
        userId: string;
        totalAmount: number;
        addressId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
    }>;
    cancelOrder(user: any, id: string, body: {
        reason?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        currency: string;
        userId: string;
        totalAmount: number;
        addressId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
    }>;
    updateOrderStatus(user: any, id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        currency: string;
        userId: string;
        totalAmount: number;
        addressId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
    }>;
    getOrderItems(user: any, orderId: string): Promise<({
        sku: {
            product: {
                name: string;
                images: string[];
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
    })[]>;
    getOrderTracking(user: any, orderId: string): Promise<{
        orderId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        shipments: ({
            events: {
                id: string;
                createdAt: Date;
                message: string | null;
                status: import("@prisma/client").$Enums.ShipmentStatus;
                shipmentId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            otp: string | null;
            status: import("@prisma/client").$Enums.ShipmentStatus;
            orderId: string;
            carrier: string;
            trackingCode: string | null;
            proofPhotoUrl: string | null;
        })[];
    }>;
    getOrderInvoice(user: any, orderId: string): Promise<{
        invoice: {
            number: string;
            id: string;
            totalAmount: number;
            orderId: string;
            issuedAt: Date;
            vatAmount: number;
            pdfUrl: string | null;
        };
        order: {
            id: string;
            totalAmount: number;
            currency: string;
            createdAt: Date;
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
    }>;
    list(user: any): Promise<({
        items: {
            id: string;
            orderId: string;
            skuId: string;
            requestedQty: number;
            settledQty: number | null;
            unitPrice: number;
        }[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: string;
            amount: number;
        }[];
        shipments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            otp: string | null;
            status: import("@prisma/client").$Enums.ShipmentStatus;
            orderId: string;
            carrier: string;
            trackingCode: string | null;
            proofPhotoUrl: string | null;
        }[];
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
    })[]>;
}
