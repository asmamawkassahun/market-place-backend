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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QnaController = void 0;
const common_1 = require("@nestjs/common");
const qna_service_1 = require("./qna.service");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const qna_dto_1 = require("./dto/qna.dto");
let QnaController = class QnaController {
    service;
    constructor(service) {
        this.service = service;
    }
    ask(user, productId, body) {
        return this.service.ask(user.userId, productId, body.question);
    }
    answer(qnaId, body) {
        return this.service.answer(qnaId, body.answer);
    }
    list(productId) {
        return this.service.list(productId);
    }
};
exports.QnaController = QnaController;
__decorate([
    (0, common_1.Post)('ask/:productId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, qna_dto_1.QnaDto]),
    __metadata("design:returntype", void 0)
], QnaController.prototype, "ask", null);
__decorate([
    (0, common_1.Post)('answer/:qnaId'),
    __param(0, (0, common_1.Param)('qnaId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QnaController.prototype, "answer", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QnaController.prototype, "list", null);
exports.QnaController = QnaController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('qna'),
    __metadata("design:paramtypes", [qna_service_1.QnaService])
], QnaController);
//# sourceMappingURL=qna.controller.js.map