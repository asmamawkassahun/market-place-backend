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
exports.GiftRegistryController = void 0;
const common_1 = require("@nestjs/common");
const gift_registry_service_1 = require("./gift-registry.service");
const create_gift_registry_dto_1 = require("./dto/create-gift-registry.dto");
const update_gift_registry_dto_1 = require("./dto/update-gift-registry.dto");
const add_gift_registry_item_dto_1 = require("./dto/add-gift-registry-item.dto");
const mark_purchased_dto_1 = require("./dto/mark-purchased.dto");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
let GiftRegistryController = class GiftRegistryController {
    giftRegistryService;
    constructor(giftRegistryService) {
        this.giftRegistryService = giftRegistryService;
    }
    create(user, createGiftRegistryDto) {
        return this.giftRegistryService.create(user.userId, createGiftRegistryDto);
    }
    findAll(user) {
        return this.giftRegistryService.findAll(user.userId);
    }
    findByShareToken(shareToken) {
        return this.giftRegistryService.findByShareToken(shareToken);
    }
    findOne(id, user) {
        return this.giftRegistryService.findOne(id, user.userId);
    }
    update(id, user, updateGiftRegistryDto) {
        return this.giftRegistryService.update(id, user.userId, updateGiftRegistryDto);
    }
    remove(id, user) {
        return this.giftRegistryService.remove(id, user.userId);
    }
    addItem(id, user, addGiftRegistryItemDto) {
        return this.giftRegistryService.addItem(id, user.userId, addGiftRegistryItemDto);
    }
    markPurchased(id, itemId, markPurchasedDto) {
        return this.giftRegistryService.markPurchased(id, itemId, markPurchasedDto);
    }
    removeItem(id, itemId, user) {
        return this.giftRegistryService.removeItem(id, itemId, user.userId);
    }
};
exports.GiftRegistryController = GiftRegistryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_gift_registry_dto_1.CreateGiftRegistryDto]),
    __metadata("design:returntype", void 0)
], GiftRegistryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GiftRegistryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public/:shareToken'),
    __param(0, (0, common_1.Param)('shareToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GiftRegistryController.prototype, "findByShareToken", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GiftRegistryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_gift_registry_dto_1.UpdateGiftRegistryDto]),
    __metadata("design:returntype", void 0)
], GiftRegistryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GiftRegistryController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, add_gift_registry_item_dto_1.AddGiftRegistryItemDto]),
    __metadata("design:returntype", void 0)
], GiftRegistryController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)(':id/items/:itemId/purchased'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, mark_purchased_dto_1.MarkPurchasedDto]),
    __metadata("design:returntype", void 0)
], GiftRegistryController.prototype, "markPurchased", null);
__decorate([
    (0, common_1.Delete)(':id/items/:itemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], GiftRegistryController.prototype, "removeItem", null);
exports.GiftRegistryController = GiftRegistryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('gift-registry'),
    __metadata("design:paramtypes", [gift_registry_service_1.GiftRegistryService])
], GiftRegistryController);
//# sourceMappingURL=gift-registry.controller.js.map