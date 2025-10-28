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
exports.GroupBuyController = exports.BulkOrderingController = void 0;
const common_1 = require("@nestjs/common");
const bulk_ordering_service_1 = require("./bulk-ordering.service");
const create_bulk_order_dto_1 = require("./dto/create-bulk-order.dto");
const bulk_order_quote_request_dto_1 = require("./dto/bulk-order-quote-request.dto");
const create_group_buy_dto_1 = require("./dto/create-group-buy.dto");
const join_group_buy_dto_1 = require("./dto/join-group-buy.dto");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const current_user_decorator_1 = require("../common/current-user.decorator");
let BulkOrderingController = class BulkOrderingController {
    bulkOrderingService;
    constructor(bulkOrderingService) {
        this.bulkOrderingService = bulkOrderingService;
    }
    getQuote(quoteRequest) {
        return this.bulkOrderingService.getBulkOrderQuote(quoteRequest);
    }
    createBulkOrder(user, createBulkOrderDto) {
        return this.bulkOrderingService.createBulkOrder(user.userId, createBulkOrderDto);
    }
    findAllBulkOrders(user) {
        return this.bulkOrderingService.findAllBulkOrders(user.userId);
    }
    findOneBulkOrder(id, user) {
        return this.bulkOrderingService.findOneBulkOrder(id, user.userId);
    }
};
exports.BulkOrderingController = BulkOrderingController;
__decorate([
    (0, common_1.Post)('quote'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_order_quote_request_dto_1.BulkOrderQuoteRequestDto]),
    __metadata("design:returntype", void 0)
], BulkOrderingController.prototype, "getQuote", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_bulk_order_dto_1.CreateBulkOrderDto]),
    __metadata("design:returntype", void 0)
], BulkOrderingController.prototype, "createBulkOrder", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BulkOrderingController.prototype, "findAllBulkOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BulkOrderingController.prototype, "findOneBulkOrder", null);
exports.BulkOrderingController = BulkOrderingController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('bulk-orders'),
    __metadata("design:paramtypes", [bulk_ordering_service_1.BulkOrderingService])
], BulkOrderingController);
let GroupBuyController = class GroupBuyController {
    bulkOrderingService;
    constructor(bulkOrderingService) {
        this.bulkOrderingService = bulkOrderingService;
    }
    createGroupBuy(user, createGroupBuyDto) {
        return this.bulkOrderingService.createGroupBuy(user.merchantId, createGroupBuyDto);
    }
    findAllGroupBuys() {
        return this.bulkOrderingService.findAllGroupBuys();
    }
    findOneGroupBuy(id) {
        return this.bulkOrderingService.findOneGroupBuy(id);
    }
    joinGroupBuy(id, user, joinGroupBuyDto) {
        return this.bulkOrderingService.joinGroupBuy(id, user.userId, joinGroupBuyDto);
    }
};
exports.GroupBuyController = GroupBuyController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('MERCHANT'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_group_buy_dto_1.CreateGroupBuyDto]),
    __metadata("design:returntype", void 0)
], GroupBuyController.prototype, "createGroupBuy", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GroupBuyController.prototype, "findAllGroupBuys", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupBuyController.prototype, "findOneGroupBuy", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, join_group_buy_dto_1.JoinGroupBuyDto]),
    __metadata("design:returntype", void 0)
], GroupBuyController.prototype, "joinGroupBuy", null);
exports.GroupBuyController = GroupBuyController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('group-buys'),
    __metadata("design:paramtypes", [bulk_ordering_service_1.BulkOrderingService])
], GroupBuyController);
//# sourceMappingURL=bulk-ordering.controller.js.map