import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance, AttendanceDocument } from './entities/attendance.entity';
import { Model } from 'mongoose';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';

export type AttendanceCondition = {
	_id?: string;
	facilityID?: string;
	accountID?: string;
};

@Injectable()
export class AttendanceService {
	constructor(
		@InjectModel(Attendance.name)
		private attendanceModel: Model<AttendanceDocument>,
		private readonly subscriptionService: SubscriptionsService,
	) {}

	async findOneByCondition(
		condition: AttendanceCondition = {},
		populate?: string,
	): Promise<Attendance> {
		const attendance = await this.attendanceModel
			.findOne(condition)
			.populate(populate);
		if (!attendance) {
			throw new NotFoundException('Attendance not found');
		}
		return attendance;
	}

	async findMany(
		condition: AttendanceCondition = {},
		options: ListOptions<Attendance> = {},
	): Promise<ListResponse<Attendance>> {
		const {
			limit = 10,
			offset = 0,
			sortField = 'updateAt',
			sortOrder = 'asc',
		} = options;

		const attendances = await this.attendanceModel
			.find(condition)
			.sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
			.limit(limit)
			.skip(offset);

		return {
			items: attendances,
			total: attendances.length,
			options: options,
		};
	}

	async create(facilityID: string, accountID: string): Promise<Attendance> {
		const isSubscribe = await this.checkActiveSubscription(
			facilityID,
			accountID,
		);

		if (!isSubscribe) {
			throw new ForbiddenException(
				"Member need to subscribe to this facility's package",
			);
		}

		let attendance = await this.attendanceModel.findOne({
			facilityID,
			accountID,
		});

		if (!attendance) {
			attendance = await this.attendanceModel.create({
				facilityID,
				accountID,
			});
		}
		const now = new Date();
		attendance.date.push(now);
		return await attendance.save();
	}

	private async checkActiveSubscription(
		facilityID: string,
		accountID: string,
	): Promise<boolean> {
		const now = new Date();
		const subscription = await this.subscriptionService.findOneByCondition({
			accountID,
			facilityID,
			expires: { $gt: now },
		});
		if (!subscription) return false;

		return true;
	}

	async delete(attendanceID: string): Promise<string> {
		const counter = await this.attendanceModel.findByIdAndDelete(attendanceID);

		if (!counter) {
			throw new NotFoundException('Counter not found');
		}
		return 'Delete attendance successful';
	}
}
