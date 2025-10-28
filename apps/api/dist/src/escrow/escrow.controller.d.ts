import { EscrowService } from './escrow.service';
import { DisputeDto, RefundDto, ReleaseDto } from './dto/escrow.dto';
export declare class EscrowController {
    private readonly service;
    constructor(service: EscrowService);
    get(paymentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.EscrowStatus;
        paymentId: string;
        holdAmount: number;
        released: number;
    }>;
    dispute(paymentId: string, body: DisputeDto): Promise<{
        id: string;
        createdAt: Date;
        paymentId: string;
        extId: string | null;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }>;
    release(paymentId: string, body: ReleaseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.EscrowStatus;
        paymentId: string;
        holdAmount: number;
        released: number;
    }>;
    refund(paymentId: string, body: RefundDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.EscrowStatus;
        paymentId: string;
        holdAmount: number;
        released: number;
    }>;
}
