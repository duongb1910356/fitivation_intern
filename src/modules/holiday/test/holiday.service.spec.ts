import { Test, TestingModule } from '@nestjs/testing';
import { ConditionHoliday, HolidayService } from '../holiday.service';
import { HolidayStub } from './stubs/holiday.stubs';
import { getModelToken } from '@nestjs/mongoose';
import { Holiday } from '../entities/holiday.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ListOptions } from 'src/shared/response/common-response';
import { HolidayDto } from '../dto/holiday-dto';

describe('FacilitySchedule', () => {
	const holidayStub = HolidayStub();
	let holidayService: HolidayService;

	const holidayModel = {
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
				HolidayService,
				{
					provide: getModelToken(Holiday.name),
					useValue: holidayModel,
				},
			],
		}).compile();

		holidayService = module.get<HolidayService>(HolidayService);
	});

	it('holidayService should be defined', () => {
		expect(holidayService).toBeDefined();
	});
	it('holidayModel should be defined', () => {
		expect(holidayModel).toBeDefined();
	});

	describe('findOneByID', () => {
		it('should throw NotFoundException if schedule not found', async () => {
			const holidayID = holidayStub._id;
			const populate = 'facilityID';

			jest.spyOn(holidayModel, 'findById').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(undefined),
			}));

			await expect(
				holidayService.findOneByID(holidayID, populate),
			).rejects.toThrow(NotFoundException);
		});

		it('should return a schedule if schedule exists', async () => {
			const holidayID = holidayStub._id;
			const populate = 'facilityID';

			jest.spyOn(holidayModel, 'findById').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(holidayStub),
			}));

			const result = await holidayService.findOneByID(holidayID, populate);

			expect(holidayModel.findById).toHaveBeenCalledWith(holidayID);

			expect(result).toEqual(holidayStub);
		});
	});

	describe('findMany', () => {
		it('should return holiday array', async () => {
			const condition: ConditionHoliday = {};
			const options: ListOptions<Holiday> = {};

			jest.spyOn(holidayModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([holidayStub]),
					}),
				}),
			}));

			const result = await holidayService.findMany(condition, options);

			expect(holidayModel.find).toHaveBeenCalledWith(condition);

			expect(result).toEqual({
				items: [holidayStub],
				total: [holidayStub].length,
				options,
			});
		});
	});

	describe('create', () => {
		it('should create and return a holiday', async () => {
			const facilityID = holidayStub.facilityID._id;
			const data: HolidayDto = {
				startDate: holidayStub.startDate,
				endDate: holidayStub.endDate,
				content: holidayStub.content,
			};
			jest
				.spyOn(holidayService as any, 'checkOverlapAndTransform')
				.mockResolvedValue([data.startDate, data.endDate]);

			jest.spyOn(holidayModel, 'create').mockResolvedValue(holidayStub);

			const result = await holidayService.create(facilityID, data);

			expect(
				(holidayService as any).checkOverlapAndTransform,
			).toHaveBeenCalledWith(facilityID, data);

			expect(holidayModel.create).toHaveBeenCalledWith({
				facilityID,
				startDate: data.startDate,
				endDate: data.endDate,
				content: data.content,
			});

			expect(result).toEqual(holidayStub);
		});
	});

	describe('update', () => {
		it('should update and return a holiday', async () => {
			const holidayID = holidayStub._id;
			const facilityID = holidayStub.facilityID._id;
			const data: HolidayDto = {
				startDate: holidayStub.startDate,
				endDate: holidayStub.endDate,
				content: holidayStub.content,
			};

			jest.spyOn(holidayService, 'findOneByID').mockResolvedValue(holidayStub);

			jest
				.spyOn(holidayService as any, 'checkOverlapAndTransform')
				.mockResolvedValue([data.startDate, data.endDate]);

			jest
				.spyOn(holidayModel, 'findByIdAndUpdate')
				.mockResolvedValue(holidayStub);

			const result = await holidayService.update(holidayID, data);

			expect(holidayService.findOneByID).toBeCalledWith(holidayID);

			expect(
				(holidayService as any).checkOverlapAndTransform,
			).toHaveBeenCalledWith(facilityID, data, holidayID);

			expect(holidayModel.findByIdAndUpdate).toHaveBeenCalledWith(
				holidayID,
				data,
				{
					new: true,
				},
			);

			expect(result).toEqual(holidayStub);
		});
	});

	describe('delete', () => {
		it('should throw NotFoundException if holiday not found', async () => {
			const holidayID = holidayStub._id;

			jest
				.spyOn(holidayModel, 'findByIdAndDelete')
				.mockResolvedValue(undefined);

			await expect(holidayService.delete(holidayID)).rejects.toThrow(
				NotFoundException,
			);
		});
		it('should delete a holiday', async () => {
			const holidayID = holidayStub._id;

			jest
				.spyOn(holidayModel, 'findByIdAndDelete')
				.mockResolvedValue(holidayStub);

			await holidayService.delete(holidayID);

			expect(holidayModel.findByIdAndDelete).toHaveBeenCalledWith(holidayID);
		});
	});

	describe('isOwner', () => {
		it('should return true if is Owner', async () => {
			const holidayID = holidayStub._id;
			const uid = '123123123123123123123123';

			jest
				.spyOn(holidayService, 'findOneByID')
				.mockResolvedValueOnce(holidayStub);

			const result = await holidayService.isOwner(holidayID, uid);

			expect(holidayService.findOneByID).toHaveBeenCalledWith(
				holidayID,
				'facilityID',
			);

			expect(result).toBe(true);
		});
		it('should return false if is Owner', async () => {
			const holidayID = holidayStub._id;
			const uid = '456456456456456456456456';

			jest
				.spyOn(holidayService, 'findOneByID')
				.mockResolvedValueOnce(holidayStub);

			const result = await holidayService.isOwner(holidayID, uid);

			expect(holidayService.findOneByID).toHaveBeenCalledWith(
				holidayID,
				'facilityID',
			);

			expect(result).toBe(false);
		});
	});

	describe('checkOverlapAndTransform', () => {
		const holidayID = holidayStub._id;
		const facilityID = holidayStub.facilityID._id;
		const data: HolidayDto = {
			startDate: holidayStub.startDate,
			endDate: holidayStub.endDate,
		};
		const query: any = {
			facilityID,
			$or: [
				{
					startDate: {
						$gte: data.startDate,
						$lt: data.endDate,
					},
				},
				{
					endDate: {
						$gt: data.startDate,
						$lte: data.endDate,
					},
				},
				{
					startDate: { $lte: data.startDate },
					endDate: { $gte: data.endDate },
				},
			],
		};
		it('should throw BadRequestException if Holiday Data is overlap', async () => {
			jest.spyOn(holidayModel, 'findOne').mockResolvedValueOnce(holidayStub);

			await expect(
				(holidayService as any).checkOverlapAndTransform(
					facilityID,
					data,
					holidayID,
				),
			).rejects.toThrow(BadRequestException);
		});
		it('should check Overlap (not has notCheckID)', async () => {
			jest.spyOn(holidayModel, 'findOne').mockResolvedValueOnce(undefined);

			const result = await (holidayService as any).checkOverlapAndTransform(
				facilityID,
				data,
			);

			expect(holidayModel.findOne).toHaveBeenCalledWith(query);

			expect(result).toEqual([data.startDate, data.endDate]);
		});
		it('should check Overlap with (has notCheckID)', async () => {
			jest.spyOn(holidayModel, 'findOne').mockResolvedValueOnce(undefined);
			query._id = { $ne: holidayID };

			const result = await (holidayService as any).checkOverlapAndTransform(
				facilityID,
				data,
			);

			expect(holidayModel.findOne).toHaveBeenCalledWith(query);

			expect(result).toEqual([data.startDate, data.endDate]);
		});
	});
});
