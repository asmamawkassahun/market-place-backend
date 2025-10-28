import { InvoicesService } from './invoices.service';
export declare class InvoicesController {
    private readonly service;
    constructor(service: InvoicesService);
    get(orderId: string): import("@prisma/client").Prisma.Prisma__InvoiceClient<{
        number: string;
        id: string;
        totalAmount: number;
        orderId: string;
        issuedAt: Date;
        vatAmount: number;
        pdfUrl: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
