import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from './app.config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AppLoggerMiddleware } from './middleware/logging.middleware';
import { GlobalExceptionFilter } from './exception-filters/global-exception.filter';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { BillsModule } from './modules/bills/bills.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { CartsModule } from './modules/carts/carts.module';
import { FacilityModule } from './modules/facility/facility.module';
import { AddressModule } from './modules/address/address.module';
import { PhotoModule } from './modules/photo/photo.module';
import { PackageTypeModule } from './modules/package-type/package-type.module';
import { BillItemsModule } from './modules/bill-items/bill-items.module';
import { CartItemsModule } from './modules/cart-items/cart-items.module';
import { PackageModule } from './modules/package/package.module';
import { FacilityCategoryModule } from './modules/facility-category/facility-category.module';
import { FacilityScheduleModule } from './modules/facility-schedule/facility-schedule.module';
import { HolidayModule } from './modules/holiday/holiday.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { CounterModule } from './modules/counter/counter.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { BrandModule } from './modules/brand/brand.module';

@Module({
	imports: [
		// Make it look good and work well
		MongooseModule.forRoot(appConfig.mongoURI),
		AdminModule,
		AuthModule,
		UsersModule,
		PromotionsModule,
		BillsModule,
		SubscriptionsModule,
		CartsModule,
		FacilityModule,
		AddressModule,
		PhotoModule,
		ReviewsModule,
		BrandModule,
		PackageTypeModule,
		BillItemsModule,
		CartItemsModule,
		PackageModule,
		FacilityCategoryModule,
		FacilityScheduleModule,
		HolidayModule,
		AttendanceModule,
		CounterModule,
		FacilityScheduleModule,
		PackageModule,
		FacilityCategoryModule,
		HolidayModule,
		AttendanceModule,
		CounterModule,
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
