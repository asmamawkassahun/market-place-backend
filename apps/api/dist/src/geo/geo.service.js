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
exports.GeoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GeoService = class GeoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async nearbyMerchants(lat, lon, radiusKm = 25) {
        const all = await this.prisma.merchant.findMany({ where: { lat: { not: null }, lon: { not: null } } });
        const R = 6371;
        const toRad = (d) => (d * Math.PI) / 180;
        return all.filter((m) => {
            if (m.lat == null || m.lon == null)
                return false;
            const dLat = toRad(m.lat - lat);
            const dLon = toRad(m.lon - lon);
            const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(m.lat)) * Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c <= radiusKm;
        });
    }
};
exports.GeoService = GeoService;
exports.GeoService = GeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeoService);
//# sourceMappingURL=geo.service.js.map