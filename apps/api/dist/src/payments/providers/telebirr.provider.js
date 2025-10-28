"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelebirrProvider = void 0;
const common_1 = require("@nestjs/common");
let TelebirrProvider = class TelebirrProvider {
    async initiate(amount, meta) {
        return {
            provider: 'telebirr',
            reference: 'TB-' + Math.random().toString(36).slice(2, 10),
            redirectUrl: 'https://telebirr.example/checkout',
            meta,
        };
    }
};
exports.TelebirrProvider = TelebirrProvider;
exports.TelebirrProvider = TelebirrProvider = __decorate([
    (0, common_1.Injectable)()
], TelebirrProvider);
//# sourceMappingURL=telebirr.provider.js.map