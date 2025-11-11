"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const terminus_1 = require("@nestjs/terminus");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const nestjs_pino_1 = require("nestjs-pino");
const health_module_1 = require("./health/health.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const addresses_module_1 = require("./addresses/addresses.module");
const merchants_module_1 = require("./merchants/merchants.module");
const catalog_module_1 = require("./catalog/catalog.module");
const products_module_1 = require("./products/products.module");
const inventory_module_1 = require("./inventory/inventory.module");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const kyc_module_1 = require("./kyc/kyc.module");
const units_module_1 = require("./units/units.module");
const pricing_module_1 = require("./pricing/pricing.module");
const shipments_module_1 = require("./shipments/shipments.module");
const loyalty_module_1 = require("./loyalty/loyalty.module");
const escrow_module_1 = require("./escrow/escrow.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const reviews_module_1 = require("./reviews/reviews.module");
const qna_module_1 = require("./qna/qna.module");
const geo_module_1 = require("./geo/geo.module");
const payouts_module_1 = require("./payouts/payouts.module");
const invoices_module_1 = require("./invoices/invoices.module");
const notifications_module_1 = require("./notifications/notifications.module");
const metrics_module_1 = require("./metrics/metrics.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const i18n_module_1 = require("./i18n/i18n.module");
const storage_module_1 = require("./storage/storage.module");
const chat_module_1 = require("./chat/chat.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const price_alerts_module_1 = require("./price-alerts/price-alerts.module");
const stock_notifications_module_1 = require("./stock-notifications/stock-notifications.module");
const gift_registry_module_1 = require("./gift-registry/gift-registry.module");
const referral_module_1 = require("./referral/referral.module");
const bulk_ordering_module_1 = require("./bulk-ordering/bulk-ordering.module");
const visual_search_module_1 = require("./visual-search/visual-search.module");
const events_module_1 = require("./events/events.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
            terminus_1.TerminusModule,
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
                    level: process.env.LOG_LEVEL ?? 'info',
                },
            }),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            addresses_module_1.AddressesModule,
            merchants_module_1.MerchantsModule,
            catalog_module_1.CatalogModule,
            products_module_1.ProductsModule,
            inventory_module_1.InventoryModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            kyc_module_1.KycModule,
            units_module_1.UnitsModule,
            pricing_module_1.PricingModule,
            shipments_module_1.ShipmentsModule,
            loyalty_module_1.LoyaltyModule,
            escrow_module_1.EscrowModule,
            webhooks_module_1.WebhooksModule,
            reviews_module_1.ReviewsModule,
            qna_module_1.QnaModule,
            geo_module_1.GeoModule,
            payouts_module_1.PayoutsModule,
            invoices_module_1.InvoicesModule,
            notifications_module_1.NotificationsModule,
            metrics_module_1.MetricsModule,
            cache_manager_1.CacheModule.register({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            i18n_module_1.I18nModule,
            storage_module_1.StorageModule,
            chat_module_1.ChatModule,
            wishlist_module_1.WishlistModule,
            price_alerts_module_1.PriceAlertsModule,
            stock_notifications_module_1.StockNotificationsModule,
            gift_registry_module_1.GiftRegistryModule,
            referral_module_1.ReferralModule,
            bulk_ordering_module_1.BulkOrderingModule,
            visual_search_module_1.VisualSearchModule,
            events_module_1.EventsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map