import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Attendance.name, schema: Attendance }]),
	],
	controllers: [AttendanceController],
	providers: [AttendanceService],
})
export class AttendanceModule {}
