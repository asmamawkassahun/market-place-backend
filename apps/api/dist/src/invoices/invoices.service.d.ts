import { PrismaService } from '../prisma/prisma.service';
export declare class InvoicesService {
    private prisma;
    constructor(prisma: PrismaService);
    generate(orderId: string): Promise<{
        number: string;
        id: string;
        totalAmount: number;
        orderId: string;
        issuedAt: Date;
        vatAmount: number;
        pdfUrl: string | null;
    } | null>;
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
