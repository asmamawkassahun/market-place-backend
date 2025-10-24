import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { MerchantsModule } from './merchants/merchants.module';
import { CatalogModule } from './catalog/catalog.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { KycModule } from './kyc/kyc.module';
import { UnitsModule } from './units/units.module';
import { PricingModule } from './pricing/pricing.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { EscrowModule } from './escrow/escrow.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ReviewsModule } from './reviews/reviews.module';
import { QnaModule } from './qna/qna.module';
import { GeoModule } from './geo/geo.module';
import { PayoutsModule } from './payouts/payouts.module';
import { InvoicesModule } from './invoices/invoices.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MetricsModule } from './metrics/metrics.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { I18nModule } from './i18n/i18n.module';
import { AppGateway } from './gateway/app.gateway';
import { ChatModule } from './chat/chat.module';
import { StorageModule } from './storage/storage.module';
// New advanced feature modules
import { WishlistModule } from './wishlist/wishlist.module';
import { PriceAlertsModule } from './price-alerts/price-alerts.module';
import { StockNotificationsModule } from './stock-notifications/stock-notifications.module';
import { GiftRegistryModule } from './gift-registry/gift-registry.module';
import { ReferralModule } from './referral/referral.module';
import { BulkOrderingModule } from './bulk-ordering/bulk-ordering.module';
import { VisualSearchModule } from './visual-search/visual-search.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    TerminusModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
        level: process.env.LOG_LEVEL ?? 'info',
      },
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    AddressesModule,
    MerchantsModule,
    CatalogModule,
    ProductsModule,
    InventoryModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    KycModule,
    UnitsModule,
    PricingModule,
    ShipmentsModule,
    LoyaltyModule,
    EscrowModule,
    WebhooksModule,
    ReviewsModule,
    QnaModule,
    GeoModule,
    PayoutsModule,
    InvoicesModule,
    NotificationsModule,
    MetricsModule,
    CacheModule.register({ isGlobal: true }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    I18nModule,
    ChatModule,
    StorageModule,
    // New advanced feature modules
    WishlistModule,
    PriceAlertsModule,
    StockNotificationsModule,
    GiftRegistryModule,
    ReferralModule,
    BulkOrderingModule,
    VisualSearchModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
