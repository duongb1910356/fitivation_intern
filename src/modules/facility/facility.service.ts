import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Facility, FacilityDocument } from './schemas/facility.schema';
import { Model } from 'mongoose';
import { FacilityScheduleService } from '../facility-schedule/facility-schedule.service';
import { CreateFacilityScheduleDto } from '../facility-schedule/dto/create-facility-schedule-dto';
import { HolidayDto } from '../holiday/dto/holiday-dto';
import { ConditionHoliday, HolidayService } from '../holiday/holiday.service';
import { ListOptions } from 'src/shared/response/common-response';
import { Holiday } from '../holiday/entities/holiday.entity';
import { PackageTypeService } from '../package-type/package-type.service';
import { PackageType } from '../package-type/entities/package-type.entity';
import { CreatePackageTypeDto } from '../package-type/dto/create-package-type-dto';
import { UpdateOrderDto } from '../package-type/dto/update-order-dto';
import { AttendanceService } from '../attendance/attendance.service';

@Injectable()
export class FacilityService {
	constructor(
		@InjectModel(Facility.name)
		private facilityModel: Model<FacilityDocument>,
		private readonly packageTypeService: PackageTypeService,
		private readonly facilityScheduleService: FacilityScheduleService,
		private readonly holidayService: HolidayService,
		private readonly attendanceService: AttendanceService,
	) {}

	async isOwner(id: string, uid: string): Promise<boolean> {
		const facility = await this.findOneByID(id);
		const owner = facility.ownerID.toString();
		return uid === owner;
	}

	async findOneByID(id: string): Promise<Facility> {
		const facility = await this.facilityModel.findById(id);
		if (!facility) {
			throw new NotFoundException('Facility not found');
		}
		return facility;
	}

	async getAllPackageType(id: string, filter: ListOptions<PackageType>) {
		return await this.packageTypeService.findManyByFacility(id, filter);
	}

	async createPackageType(id: string, data: CreatePackageTypeDto) {
		return await this.packageTypeService.create(id, data);
	}

	async swapPackageTypeInList(id: string, data: UpdateOrderDto) {
		return this.packageTypeService.swapOrder(id, data);
	}

	async findAllSchedules(id: string) {
		return await this.facilityScheduleService.findMany({
			facilityID: id,
		});
	}

	async getCurrentSchedule(id: string) {
		const facility = await this.findOneByID(id);
		const condition = {
			facilityID: id,
			type: facility.scheduleType,
		};
		return await this.facilityScheduleService.findOneByCondition(condition);
	}

	async createSchedule(id: string, data: CreateFacilityScheduleDto) {
		return await this.facilityScheduleService.create(id, data);
	}

	async createHoliday(id: string, data: HolidayDto) {
		return await this.holidayService.create(id, data);
	}

	async findAllHoliday(id: string, options: ListOptions<Holiday>) {
		let condition: ConditionHoliday = { facilityID: id };
		if (options.startDate) {
			condition = {
				...condition,
				startDate: { $gte: options.startDate },
			};
		}
		if (options.endDate) {
			condition = {
				...condition,
				endDate: { $lte: options.endDate },
			};
		}
		return await this.holidayService.findMany(condition, options);
	}

	async createAttendance(facilityID: string, accountID: string) {
		return await this.attendanceService.create(facilityID, accountID);
	}

	async getAttendance(facilityID: string, accountID: string) {
		return await this.attendanceService.findOneByCondition({
			facilityID,
			accountID,
		});
	}
}
