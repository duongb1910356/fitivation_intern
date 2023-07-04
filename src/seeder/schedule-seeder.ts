import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { FacilitySchedule } from 'src/modules/facility-schedule/entities/facility-schedule.entity';
import { scheduleData } from './data/schedule-data';

@Injectable()
export class ScheduleSeeder implements Seeder {
	constructor(
		@InjectModel(FacilitySchedule.name)
		private readonly facilityScheduleModel: Model<FacilitySchedule>,
	) {}

	async seed(): Promise<any> {
		await this.facilityScheduleModel.insertMany(scheduleData);
	}

	async drop(): Promise<any> {
		await this.facilityScheduleModel.deleteMany({});
	}
}
