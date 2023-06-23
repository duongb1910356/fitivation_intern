import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PackageTypeModule } from '../package-type/package-type.module';
import { PackageModule } from '../package/package.module';
import { FacilityCategoryModule } from '../facility-category/facility-category.module';
import { FacilityScheduleModule } from '../facility-schedule/facility-schedule.module';
import { HolidayModule } from '../holiday/holiday.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
	imports: [
		PackageTypeModule,
		PackageModule,
		FacilityCategoryModule,
		FacilityScheduleModule,
		HolidayModule,
		AttendanceModule,
	],
	controllers: [AdminController],
})
export class AdminModule {}
