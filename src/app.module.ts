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
import { FacilityModule } from './modules/facility/facility.module';
import { AddressModule } from './modules/address/address.module';
import { Review } from './modules/reviews/schemas/reviews.schema';
import { PhotoModule } from './modules/photo/photo.module';
import { PackageTypeModule } from './modules/package-type/package-type.module';


@Module({
	imports: [
		// Make it look good and work well
		MongooseModule.forRoot(appConfig.mongoURI),
		AuthModule,
		UsersModule,
		FacilityModule,
		AddressModule,
		PhotoModule,
		Review,
		PackageTypeModule,
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
