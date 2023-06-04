import { Module } from '@nestjs/common';
import { FacilityScheduleController } from './facility-schedule.controller';
import { FacilityScheduleService } from './facility-schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilitySchedule } from './entities/facility-schedule.entity';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: FacilitySchedule.name, schema: FacilitySchedule },
		]),
	],
	controllers: [FacilityScheduleController],
	providers: [FacilityScheduleService],
})
export class FacilityScheduleModule {}
