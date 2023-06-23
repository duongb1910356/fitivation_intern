import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Facility, FacilitySchema } from './schemas/facility.schema';
import { Brand, BrandSchema } from '../brand/schemas/brand.schema';
import { AttendanceModule } from '../attendance/attendance.module';
import { FacilityScheduleModule } from '../facility-schedule/facility-schedule.module';
import { HolidayModule } from '../holiday/holiday.module';
import { PackageTypeModule } from '../package-type/package-type.module';
import { FacilityService } from './facility.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Facility.name, schema: FacilitySchema },
		]),
		MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
		PackageTypeModule,
		HolidayModule,
		FacilityScheduleModule,
		AttendanceModule,
	],
	controllers: [FacilityController],
	providers: [FacilityService],
	exports: [FacilityService],
})
export class FacilityModule {}
