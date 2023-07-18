import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Holiday, HolidayDocument } from './entities/holiday.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HolidayDto } from './dto/holiday-dto';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';

export type ConditionHoliday = {
	facilityID?: string;
	startDate?: object;
	endDate?: object;
};

@Injectable()
export class HolidayService {
	constructor(
		@InjectModel(Holiday.name)
		private holidayModel: Model<HolidayDocument>,
	) {}

	async findOneByID(holidayID: string, populate?: string): Promise<Holiday> {
		const holiday = await this.holidayModel
			.findById(holidayID)
			.populate(populate);

		if (!holiday) {
			throw new NotFoundException('Holiday not found ');
		}
		return holiday;
	}

	async findMany(
		condition: ConditionHoliday = {},
		options: ListOptions<Holiday> = {},
	): Promise<ListResponse<Holiday>> {
		const sortQuery = {};
		sortQuery[options.sortField] = options.sortOrder === 'asc' ? 1 : -1;
		const limit = options.limit || 0;
		const offset = options.offset || 0;

		const holidays = await this.holidayModel
			.find(condition)
			.sort(sortQuery)
			.limit(limit)
			.skip(offset);

		return {
			items: holidays,
			total: holidays.length,
			options: options,
		};
	}

	async create(facilityID: string, data: HolidayDto): Promise<Holiday> {
		const [startDate, endDate] = await this.checkOverlapAndTransform(
			facilityID,
			data,
		);
		const holidayData = {
			facilityID,
			startDate,
			endDate,
			content: data.content,
		};
		return await this.holidayModel.create(holidayData);
	}

	async update(holidayID: string, data: HolidayDto): Promise<Holiday> {
		const facilityID = (await this.findOneByID(holidayID)).facilityID._id;
		const [startDate, endDate] = await this.checkOverlapAndTransform(
			facilityID,
			data,
			holidayID,
		);
		const updateData = { content: data.content, startDate, endDate };

		const holiday = await this.holidayModel.findByIdAndUpdate(
			holidayID,
			updateData,
			{
				new: true,
			},
		);
		return holiday;
	}

	async delete(holidayID: string): Promise<string> {
		const holiday = await this.holidayModel.findByIdAndDelete(holidayID);

		if (!holiday) {
			throw new NotFoundException('Holiday not found');
		}

		return 'Delete holiday successful';
	}

	async isOwner(holidayID: string, uid: string): Promise<boolean> {
		const holiday = await this.findOneByID(holidayID, 'facilityID');
		const owner = holiday.facilityID.ownerID.toString();
		return uid == owner;
	}

	private async checkOverlapAndTransform(
		facilityID: string,
		data: HolidayDto,
		notCheckID?: string,
	) {
		const startDateData = new Date(data.startDate);
		const endDateData = new Date(data.endDate);

		const query: any = {
			facilityID,
			$or: [
				{
					startDate: {
						$gte: startDateData,
						$lt: endDateData,
					},
				},
				{
					endDate: {
						$gt: startDateData,
						$lte: endDateData,
					},
				},
				{
					startDate: { $lte: startDateData },
					endDate: { $gte: endDateData },
				},
			],
		};
		if (notCheckID) {
			query._id = { $ne: notCheckID };
		}

		const existingHoliday = await this.holidayModel.findOne(query);
		if (existingHoliday)
			throw new BadRequestException('Holiday Data is overlap');

		return [startDateData, endDateData];
	}
}
