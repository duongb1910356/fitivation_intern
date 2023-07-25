import {
	ConditionSchedule,
	FacilityScheduleService,
} from '../facility-schedule.service';
import { ScheduleStub } from './stubs/facility-schedule.stub';
import { FacilitySchedule } from '../entities/facility-schedule.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ListOptions } from 'src/shared/response/common-response';
import { FacilityScheduleDto } from '../dto/facility-schedule-dto';

describe('FacilitySchedule', () => {
	const scheduleStub = ScheduleStub();
	let scheduleService: FacilityScheduleService;

	const scheduleModel = {
		findOne: jest.fn(),
		findById: jest.fn().mockReturnThis(),
		find: jest.fn().mockReturnThis(),
		populate: jest.fn(),
		sort: jest.fn(),
		limit: jest.fn(),
		skip: jest.fn(),
		exec: jest.fn(),
		save: jest.fn(),
		create: jest.fn(),
		updateOne: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findByIdAndDelete: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FacilityScheduleService,
				{
					provide: getModelToken(FacilitySchedule.name),
					useValue: scheduleModel,
				},
			],
		}).compile();

		scheduleService = module.get<FacilityScheduleService>(
			FacilityScheduleService,
		);
	});

	it('scheduleService should be defined', () => {
		expect(scheduleService).toBeDefined();
	});

	describe('findOneByCondition', () => {
		it('should throw NotFoundException if schedule not found', async () => {
			const condition: ConditionSchedule = {};
			const populate = 'facilityID';

			jest.spyOn(scheduleModel, 'findOne').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(undefined),
			}));

			await expect(
				scheduleService.findOneByCondition(condition, populate),
			).rejects.toThrow(NotFoundException);
		});

		it('should return a schedule if schedule exists', async () => {
			const condition: ConditionSchedule = {};
			const populate = 'facilityID';

			jest.spyOn(scheduleModel, 'findOne').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(scheduleStub),
			}));

			const result = await scheduleService.findOneByCondition(
				condition,
				populate,
			);

			expect(scheduleModel.findOne).toHaveBeenCalledWith(condition);

			expect(result).toEqual(scheduleStub);
		});
	});

	describe('findOneByID', () => {
		it('should throw NotFoundException if schedule not found', async () => {
			const scheduleID = scheduleStub._id;
			const populate = 'facilityID';

			jest.spyOn(scheduleModel, 'findById').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(undefined),
			}));

			await expect(
				scheduleService.findOneByID(scheduleID, populate),
			).rejects.toThrow(NotFoundException);
		});

		it('should return a schedule if schedule exists', async () => {
			const scheduleID = scheduleStub._id;
			const populate = 'facilityID';

			jest.spyOn(scheduleModel, 'findById').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(scheduleStub),
			}));

			const result = await scheduleService.findOneByID(scheduleID, populate);

			expect(scheduleModel.findById).toHaveBeenCalledWith(scheduleID);

			expect(result).toEqual(scheduleStub);
		});
	});

	describe('findMany', () => {
		it('should return schedule array', async () => {
			const condition: ConditionSchedule = {};
			const options: ListOptions<FacilitySchedule> = {};

			jest.spyOn(scheduleModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([scheduleStub]),
					}),
				}),
			}));

			const result = await scheduleService.findMany(condition, options);

			expect(scheduleModel.find).toHaveBeenCalledWith(condition);

			expect(result).toEqual({
				items: [scheduleStub],
				total: [scheduleStub].length,
				options,
			});
		});
	});

	describe('create', () => {
		it('should throw BadRequestException if schedule already exists', async () => {
			const facilityID = scheduleStub.facilityID._id;
			const data: FacilityScheduleDto = {
				type: scheduleStub.type,
				openTime: scheduleStub.openTime,
			};
			jest.spyOn(scheduleModel, 'findOne').mockResolvedValue(scheduleStub);

			await expect(scheduleService.create(facilityID, data)).rejects.toThrow(
				BadRequestException,
			);
		});
		it('should create and return a schedule', async () => {
			const facilityID = scheduleStub.facilityID._id;
			const data: FacilityScheduleDto = {
				type: scheduleStub.type,
				openTime: scheduleStub.openTime,
			};

			jest.spyOn(scheduleModel, 'findOne').mockResolvedValue(undefined);

			jest.spyOn(scheduleModel, 'create').mockResolvedValue(scheduleStub);

			const result = await scheduleService.create(facilityID, data);

			expect(scheduleModel.findOne).toHaveBeenCalledWith({
				facilityID,
				type: data.type,
			});

			expect(scheduleModel.create).toHaveBeenCalledWith({
				...data,
				facilityID,
			});

			expect(result).toEqual(scheduleStub);
		});
	});

	describe('update', () => {
		it('should throw BadRequestException if schedule already exists', async () => {
			const facilityID = scheduleStub.facilityID._id;
			const data: FacilityScheduleDto = {
				type: scheduleStub.type,
				openTime: scheduleStub.openTime,
			};

			jest.spyOn(scheduleModel, 'findOne').mockResolvedValue(scheduleStub);

			await expect(scheduleService.update(facilityID, data)).rejects.toThrow(
				BadRequestException,
			);
		});
		it('should update and return a schedule', async () => {
			const scheduleID = scheduleStub._id;
			const data: FacilityScheduleDto = {
				type: scheduleStub.type,
				openTime: scheduleStub.openTime,
			};

			jest
				.spyOn(scheduleService, 'findOneByID')
				.mockResolvedValue(scheduleStub);

			jest.spyOn(scheduleModel, 'findOne').mockResolvedValue(undefined);

			jest
				.spyOn(scheduleModel, 'findByIdAndUpdate')
				.mockResolvedValue(scheduleStub);

			const result = await scheduleService.update(scheduleID, data);

			expect(scheduleService.findOneByID).toHaveBeenCalledWith(scheduleID);

			expect(scheduleModel.findOne).toHaveBeenCalledWith({
				facilityID: scheduleStub.facilityID._id,
				type: data.type,
				_id: { $ne: scheduleID },
			});

			expect(scheduleModel.findByIdAndUpdate).toHaveBeenCalledWith(
				scheduleID,
				data,
				{ new: true },
			);

			expect(result).toEqual(scheduleStub);
		});
	});

	describe('delete', () => {
		it('should throw NotFoundException if schedule not found', async () => {
			const scheduleID = scheduleStub._id;

			jest
				.spyOn(scheduleModel, 'findByIdAndDelete')
				.mockResolvedValue(undefined);

			await expect(scheduleService.delete(scheduleID)).rejects.toThrow(
				NotFoundException,
			);
		});
		it('should call model and delete', async () => {
			const scheduleID = scheduleStub._id;

			jest
				.spyOn(scheduleModel, 'findByIdAndDelete')
				.mockResolvedValue(scheduleStub);

			await scheduleService.delete(scheduleID);

			expect(scheduleModel.findByIdAndDelete).toHaveBeenCalledWith(scheduleID);
		});
	});

	describe('isOwner', () => {
		it('should return true if is Owner', async () => {
			const scheduleID = scheduleStub._id;
			const uid = '123123123123123123123123';

			jest
				.spyOn(scheduleService, 'findOneByID')
				.mockResolvedValueOnce(scheduleStub);

			const result = await scheduleService.isOwner(scheduleID, uid);

			expect(scheduleService.findOneByID).toHaveBeenCalledWith(
				scheduleID,
				'facilityID',
			);

			expect(result).toBe(true);
		});
		it('should return false if is Owner', async () => {
			const scheduleID = scheduleStub._id;
			const uid = '456456456456456456456456';

			jest
				.spyOn(scheduleService, 'findOneByID')
				.mockResolvedValueOnce(scheduleStub);

			const result = await scheduleService.isOwner(scheduleID, uid);

			expect(scheduleService.findOneByID).toHaveBeenCalledWith(
				scheduleID,
				'facilityID',
			);

			expect(result).toBe(false);
		});
	});
});
