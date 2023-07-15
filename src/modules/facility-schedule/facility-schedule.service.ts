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
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { FacilityScheduleDto } from './dto/facility-schedule-dto';

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
		const schedule = await this.scheduleModel
			.findOne(condition)
			.populate(populate);

		if (!schedule) {
			throw new NotFoundException('Schedule not found');
		}
		return schedule;
	}

	async findOneByID(
		scheduleID: string,
		populate?: string,
	): Promise<FacilitySchedule> {
		const schedule = await this.scheduleModel
			.findById(scheduleID)
			.populate(populate);

		if (!schedule) {
			throw new NotFoundException('Schedule not found');
		}
		return schedule;
	}

	async findMany(
		condition: ConditionSchedule = {},
		options: ListOptions<FacilitySchedule> = {},
	): Promise<ListResponse<FacilitySchedule>> {
		const sortQuery = {};
		sortQuery[options.sortField] = options.sortOrder === 'asc' ? 1 : -1;
		const limit = options.limit || 0;
		const offset = options.offset || 0;
		const schedules = await this.scheduleModel
			.find(condition)
			.sort(sortQuery)
			.limit(limit)
			.skip(offset);

		return {
			items: schedules,
			total: schedules.length,
			options,
		};
	}

	async create(
		facilityID: string,
		data: FacilityScheduleDto,
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
		data: FacilityScheduleDto,
	): Promise<FacilitySchedule> {
		const scheduleCurrent = await this.findOneByID(scheduleID);
		const isExist = await this.scheduleModel.findOne({
			facilityID: scheduleCurrent.facilityID._id,
			type: data.type,
			_id: { $ne: scheduleID },
		});
		if (isExist) {
			throw new BadRequestException(
				`${data.type} STYLE SCHEDULE ALREADY EXISTS`,
			);
		}

		const schedule = await this.scheduleModel.findByIdAndUpdate(
			scheduleID,
			data,
			{
				new: true,
			},
		);
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
		const schedule = await this.findOneByID(scheduleID, 'facilityID');
		return uid === schedule.facilityID.ownerID;
	}
}
