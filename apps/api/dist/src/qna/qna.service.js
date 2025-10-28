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
exports.QnaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QnaService = class QnaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    ask(userId, productId, question) {
        return this.prisma.qna.create({ data: { userId, productId, question } });
    }
    answer(qnaId, answer) {
        return this.prisma.qna.update({ where: { id: qnaId }, data: { answer, answeredAt: new Date() } });
    }
    list(productId) { return this.prisma.qna.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } }); }
};
exports.QnaService = QnaService;
exports.QnaService = QnaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QnaService);
//# sourceMappingURL=qna.service.js.map