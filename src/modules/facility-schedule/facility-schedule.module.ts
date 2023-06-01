import { Module } from '@nestjs/common';
import { FacilityScheduleController } from './facility-schedule.controller';
import { FacilityScheduleService } from './facility-schedule.service';

@Module({
	controllers: [FacilityScheduleController],
	providers: [FacilityScheduleService],
})
export class FacilityScheduleModule {}
