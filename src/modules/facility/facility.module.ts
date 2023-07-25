import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceModule } from '../attendance/attendance.module';
import { FacilityScheduleModule } from '../facility-schedule/facility-schedule.module';
import { HolidayModule } from '../holiday/holiday.module';
import { PackageTypeModule } from '../package-type/package-type.module';
import { Facility, FacilitySchemaFactory } from './schemas/facility.schema';
import { FacilityService } from './facility.service';
import { ReviewsModule } from '../reviews/reviews.module';
import { PhotoModule } from '../photo/photo.module';
import { PromotionsModule } from '../promotions/promotions.module';
import { PackageModule } from '../package/package.module';
import { BrandModule } from '../brand/brand.module';

@Module({
	// imports: [
	// 	MongooseModule.forFeature([
	// 		{ name: Facility.name, schema: FacilitySchema },
	// 	]),
	// 	MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
	// ],
	// controllers: [FacilityController],
	// providers: [FacilityService],
	// exports: [FacilityService],

	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Facility.name,
				useFactory: FacilitySchemaFactory,
				inject: [],
				imports: [],
			},
		]),
		PhotoModule,
		ReviewsModule,
		PackageTypeModule,
		HolidayModule,
		FacilityScheduleModule,
		AttendanceModule,
		PromotionsModule,
		PackageModule,
		BrandModule,
	],
	controllers: [FacilityController],
	providers: [FacilityService],
	exports: [FacilityService],
})
export class FacilityModule {}
