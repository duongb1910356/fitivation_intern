import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from './app.config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AppLoggerMiddleware } from './middleware/logging.middleware';
import { GlobalExceptionFilter } from './exception-filters/global-exception.filter';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { BillsModule } from './modules/bills/bills.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { CartsModule } from './modules/carts/carts.module';
import { CartItemsModule } from './modules/cart-items/cart-items.module';

@Module({
	imports: [
		// Make it look good and work well
		MongooseModule.forRoot(appConfig.mongoURI),
		AuthModule,
		UsersModule,
		PromotionsModule,
		BillsModule,
		SubscriptionsModule,
		CartsModule,
		CartItemsModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}

	constructor() {
		console.log({ appConfig });
	}
}
