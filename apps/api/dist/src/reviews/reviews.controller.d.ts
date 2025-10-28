import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly service;
    constructor(service: ReviewsService);
    create(user: any, productId: string, body: CreateReviewDto): import("@prisma/client").Prisma.Prisma__ReviewClient<{
        id: string;
        createdAt: Date;
        rating: number;
        images: string[];
        userId: string;
        productId: string;
        comment: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    list(productId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        rating: number;
        images: string[];
        userId: string;
        productId: string;
        comment: string | null;
    }[]>;
}
