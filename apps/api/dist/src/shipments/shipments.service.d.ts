import { PrismaService } from '../prisma/prisma.service';
import { ManualCarrier } from './carriers/manual.carrier';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ShipmentsService {
    private prisma;
    private manual;
    private notify;
    constructor(prisma: PrismaService, manual: ManualCarrier, notify: NotificationsService);
    create(orderId: string, carrier?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        otp: string | null;
        status: import("@prisma/client").$Enums.ShipmentStatus;
        orderId: string;
        carrier: string;
        trackingCode: string | null;
        proofPhotoUrl: string | null;
    }>;
    confirmDelivery(shipmentId: string, otp: string): Promise<{
        ok: boolean;
    }>;
}
