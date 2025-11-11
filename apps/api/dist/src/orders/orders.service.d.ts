import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMerchantByOwnerId(ownerId: string): Promise<{
        id: string;
    } | null>;
    createFromCart(userId: string, addressId: string, paymentProvider: string): Promise<{
        orderId: string;
        paymentId: string;
    }>;
    list(userId: string): import("@prisma/client").Prisma.PrismaPromise<({
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
    getOrders(userId: string, params: any): Promise<{
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
    getOrder(userId: string, id: string): Promise<{
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
    createOrder(userId: string, data: any): Promise<void>;
    updateOrder(userId: string, id: string, data: any): Promise<{
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
    cancelOrder(userId: string, id: string, reason?: string): Promise<{
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
    updateOrderStatus(userId: string, id: string, status: string): Promise<{
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
    getOrderItems(userId: string, orderId: string): Promise<({
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
    getOrderTracking(userId: string, orderId: string): Promise<{
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
    getOrderInvoice(userId: string, orderId: string): Promise<{
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
    getMerchantOrders(merchantId: string, params: any): Promise<{
        orders: ({
            user: {
                id: string;
                name: string | null;
                phone: string | null;
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
}
