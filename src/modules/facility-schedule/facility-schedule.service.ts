import { Injectable, NotFoundException } from '@nestjs/common';
import {
	FacilitySchedule,
	FacilityScheduleDocument,
} from './entities/facility-schedule.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';

@Injectable()
export class FacilityScheduleService {
	constructor(
		@InjectModel(FacilitySchedule.name)
		private scheduleModel: Model<FacilityScheduleDocument>,
	) {}

	async findById(
		scheduleID: string,
		populateOptions?: PopulateOptions,
	): Promise<FacilitySchedule> {
		const schedule = await this.scheduleModel
			.findById(scheduleID)
			.populate(populateOptions);
		if (!schedule) {
			throw new NotFoundException('Schedule not found');
		}
		return schedule;
	}
}
