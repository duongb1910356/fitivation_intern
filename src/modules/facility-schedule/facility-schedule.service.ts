import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import {
	FacilitySchedule,
	FacilityScheduleDocument,
} from './entities/facility-schedule.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { CreateFacilityScheduleDto } from './dto/create-facility-schedule-dto';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { UpdateFacilityScheduleDto } from './dto/update-facility-schedule-dto';

@Injectable()
export class FacilityScheduleService {
	constructor(
		@InjectModel(FacilitySchedule.name)
		private scheduleModel: Model<FacilityScheduleDocument>,
	) {}

	async findOneByCondition(
		condition: object,
		populateOptions?: PopulateOptions,
	): Promise<FacilitySchedule> {
		const schedule = await this.scheduleModel
			.findOne(condition)
			.populate(populateOptions);

		if (!schedule) {
			throw new NotFoundException('Schedule not found');
		}
		return schedule;
	}

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

	async findMany(
		filter: ListOptions<FacilitySchedule>,
	): Promise<ListResponse<FacilitySchedule>> {
		const { limit, offset, sortField, sortOrder, ...conditions } = filter;

		const schedules = await this.scheduleModel
			.find(conditions)
			.sort({ [sortField]: sortOrder === 'asc' ? -1 : 1, updateAt: 1 })
			.limit(limit)
			.skip(offset);

		if (!schedules.length) throw new NotFoundException('Schedules not found');

		return {
			items: schedules,
			total: schedules.length,
			options: filter,
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
		const schedule = await this.findById(scheduleID, {
			path: 'facilityID',
		});
		return uid === schedule.facilityID.ownerID.toString();
	}
}
