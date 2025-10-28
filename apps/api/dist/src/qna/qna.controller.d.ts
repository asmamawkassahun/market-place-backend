import { QnaService } from './qna.service';
import { QnaDto } from './dto/qna.dto';
export declare class QnaController {
    private readonly service;
    constructor(service: QnaService);
    ask(user: any, productId: string, body: QnaDto): import("@prisma/client").Prisma.Prisma__QnaClient<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        question: string;
        answer: string | null;
        answeredAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    answer(qnaId: string, body: {
        answer: string;
    }): import("@prisma/client").Prisma.Prisma__QnaClient<{
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
