"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkOrderingModule = void 0;
const common_1 = require("@nestjs/common");
const bulk_ordering_service_1 = require("./bulk-ordering.service");
const bulk_ordering_controller_1 = require("./bulk-ordering.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let BulkOrderingModule = class BulkOrderingModule {
};
exports.BulkOrderingModule = BulkOrderingModule;
exports.BulkOrderingModule = BulkOrderingModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [bulk_ordering_controller_1.BulkOrderingController, bulk_ordering_controller_1.GroupBuyController],
        providers: [bulk_ordering_service_1.BulkOrderingService],
        exports: [bulk_ordering_service_1.BulkOrderingService],
    })
], BulkOrderingModule);
//# sourceMappingURL=bulk-ordering.module.js.map