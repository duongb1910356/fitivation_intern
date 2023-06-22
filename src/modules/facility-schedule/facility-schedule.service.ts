import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import {
	FacilitySchedule,
	FacilityScheduleDocument,
	ScheduleType,
} from './entities/facility-schedule.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFacilityScheduleDto } from './dto/create-facility-schedule-dto';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { UpdateFacilityScheduleDto } from './dto/update-facility-schedule-dto';

export type ConditionSchedule = {
	facilityID?: string;
	type?: ScheduleType;
};

@Injectable()
export class FacilityScheduleService {
	constructor(
		@InjectModel(FacilitySchedule.name)
		private scheduleModel: Model<FacilityScheduleDocument>,
	) {}

	async findOneByCondition(
		condition: ConditionSchedule,
		populate?: string,
	): Promise<FacilitySchedule> {
		let schedule: FacilitySchedule;
		if (populate) {
			schedule = await this.scheduleModel.findOne(condition).populate(populate);
		} else {
			schedule = await this.scheduleModel.findById(condition);
		}

		if (!schedule) {
			throw new NotFoundException('Schedule not found');
		}
		return schedule;
	}

	async findById(
		scheduleID: string,
		populate?: string,
	): Promise<FacilitySchedule> {
		let schedule: FacilitySchedule;
		if (populate) {
			schedule = await this.scheduleModel
				.findById(scheduleID)
				.populate(populate);
		} else {
			schedule = await this.scheduleModel.findById(scheduleID);
		}

		if (!schedule) {
			throw new NotFoundException('Schedule not found');
		}
		return schedule;
	}

	async findMany(
		condition: ConditionSchedule = {},
		options: ListOptions<FacilitySchedule> = {},
	): Promise<ListResponse<FacilitySchedule>> {
		const {
			limit = 10,
			offset = 0,
			sortField = 'updatedAt',
			sortOrder = 'asc',
			projection,
		} = options;

		const schedules = await this.scheduleModel
			.find(condition, projection)
			.sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
			.limit(limit)
			.skip(offset);
		if (!schedules.length) throw new NotFoundException('Schedules not found');

		return {
			items: schedules,
			total: schedules.length,
			options: options,
		};
	}

	async create(
		facilityID: string,
		data: CreateFacilityScheduleDto,
	): Promise<FacilitySchedule> {
		const isExist = await this.scheduleModel.findOne({
			facilityID,
			type: data.type,
		});

		if (isExist) {
			throw new BadRequestException(
				`${data.type} STYLE SCHEDULE ALREADY EXISTS`,
			);
		}

		const scheduleData = { ...data, facilityID };
		return await this.scheduleModel.create(scheduleData);
	}

	async update(
		scheduleID: string,
		data: UpdateFacilityScheduleDto,
	): Promise<FacilitySchedule> {
		const schedule = await this.scheduleModel.findByIdAndUpdate(
			scheduleID,
			data,
			{
				new: true,
			},
		);
		if (!schedule) throw new NotFoundException('Schedule not found');
		return schedule;
	}

	async delete(scheduleID: string): Promise<string> {
		const schedule = await this.scheduleModel.findByIdAndDelete(scheduleID);

		if (!schedule) {
			throw new NotFoundException('Schedule not found');
		}

		return 'Delete Schedule successful';
	}

	async isOwner(scheduleID: string, uid: string): Promise<boolean> {
		const schedule = await this.findById(scheduleID, 'facilityID');
		return uid === schedule.facilityID.ownerID.toString();
	}
}
