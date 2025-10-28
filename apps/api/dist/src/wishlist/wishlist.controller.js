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
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const wishlist_service_1 = require("./wishlist.service");
const create_wishlist_dto_1 = require("./dto/create-wishlist.dto");
const update_wishlist_dto_1 = require("./dto/update-wishlist.dto");
const add_wishlist_item_dto_1 = require("./dto/add-wishlist-item.dto");
const jwt_auth_guard_1 = require("../common/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
let WishlistController = class WishlistController {
    wishlistService;
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    create(user, createWishlistDto) {
        return this.wishlistService.create(user.userId, createWishlistDto);
    }
    findAll(user) {
        return this.wishlistService.findAll(user.userId);
    }
    findByShareToken(shareToken) {
        return this.wishlistService.findByShareToken(shareToken);
    }
    findOne(id, user) {
        return this.wishlistService.findOne(id, user.userId);
    }
    update(id, user, updateWishlistDto) {
        return this.wishlistService.update(id, user.userId, updateWishlistDto);
    }
    remove(id, user) {
        return this.wishlistService.remove(id, user.userId);
    }
    addItem(id, user, addWishlistItemDto) {
        return this.wishlistService.addItem(id, user.userId, addWishlistItemDto);
    }
    removeItem(id, itemId, user) {
        return this.wishlistService.removeItem(id, itemId, user.userId);
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_wishlist_dto_1.CreateWishlistDto]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public/:shareToken'),
    __param(0, (0, common_1.Param)('shareToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "findByShareToken", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_wishlist_dto_1.UpdateWishlistDto]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, add_wishlist_item_dto_1.AddWishlistItemDto]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "addItem", null);
__decorate([
    (0, common_1.Delete)(':id/items/:itemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "removeItem", null);
exports.WishlistController = WishlistController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('wishlist'),
    __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map