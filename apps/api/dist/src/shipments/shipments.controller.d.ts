import { ShipmentsService } from './shipments.service';
import { ConfirmShipmentDto } from './dto/confirm-shipment.dto';
export declare class ShipmentsController {
    private readonly service;
    constructor(service: ShipmentsService);
    create(orderId: string): Promise<{
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
    confirm(shipmentId: string, body: ConfirmShipmentDto): Promise<{
        ok: boolean;
    }>;
}
