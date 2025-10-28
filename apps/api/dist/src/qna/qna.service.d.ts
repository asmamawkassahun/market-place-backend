import { PrismaService } from '../prisma/prisma.service';
export declare class QnaService {
    private prisma;
    constructor(prisma: PrismaService);
    ask(userId: string, productId: string, question: string): import("@prisma/client").Prisma.Prisma__QnaClient<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        question: string;
        answer: string | null;
        answeredAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    answer(qnaId: string, answer: string): import("@prisma/client").Prisma.Prisma__QnaClient<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        question: string;
        answer: string | null;
        answeredAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    list(productId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        question: string;
        answer: string | null;
        answeredAt: Date | null;
    }[]>;
}
