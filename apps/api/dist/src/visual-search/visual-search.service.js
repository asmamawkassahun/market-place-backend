"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualSearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VisualSearchService = class VisualSearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchSimilarProducts(data) {
        const whereClause = {
            active: true,
        };
        if (data.categoryId) {
            whereClause.product = {
                categoryId: data.categoryId,
            };
        }
        if (data.minPrice !== undefined || data.maxPrice !== undefined) {
            whereClause.pricePerCanonicalUnit = {};
            if (data.minPrice !== undefined) {
                whereClause.pricePerCanonicalUnit.gte = data.minPrice * 100;
            }
            if (data.maxPrice !== undefined) {
                whereClause.pricePerCanonicalUnit.lte = data.maxPrice * 100;
            }
        }
        const skus = await this.prisma.sku.findMany({
            where: whereClause,
            include: {
                product: {
                    include: {
                        merchant: {
                            select: {
                                displayName: true,
                                rating: true,
                            },
                        },
                        category: true,
                    },
                },
            },
            take: data.limit || 10,
            orderBy: { pricePerCanonicalUnit: 'asc' },
        });
        const results = skus.map((sku, index) => ({
            ...sku,
            similarityScore: Math.max(0.1, 1 - (index * 0.1)),
            matchReason: this.generateMockMatchReason(sku.product.name),
        }));
        return {
            query: {
                imageUrl: data.imageUrl,
                filters: {
                    categoryId: data.categoryId,
                    minPrice: data.minPrice,
                    maxPrice: data.maxPrice,
                },
            },
            results,
            totalResults: results.length,
            searchId: this.generateSearchId(),
        };
    }
    generateMockMatchReason(productName) {
        const reasons = [
            'Similar color and style',
            'Matching product category',
            'Similar price range',
            'Popular choice in this category',
            'Recommended based on visual similarity',
            'Similar brand and design',
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    }
    generateSearchId() {
        return `vs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async analyzeImage(imageUrl) {
        return {
            labels: ['electronics', 'gadget', 'device'],
            colors: ['black', 'silver'],
            text: [],
            confidence: 0.85,
        };
    }
};
exports.VisualSearchService = VisualSearchService;
exports.VisualSearchService = VisualSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VisualSearchService);
//# sourceMappingURL=visual-search.service.js.map