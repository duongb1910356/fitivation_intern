import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceCondition, AttendanceService } from '../attendance.service';
import { AttendanceStub } from './stubs/attendance.stub';
import { getModelToken } from '@nestjs/mongoose';
import { Attendance } from '../entities/attendance.entity';
import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ListOptions } from 'src/shared/response/common-response';
import {
	Subscription,
	SubscriptionStatus,
} from 'src/modules/subscriptions/schemas/subscription.schema';

jest.mock('../../subscriptions/subscriptions.service');
describe('Attendance', () => {
	const attendanceStub = AttendanceStub();
	let attendanceService: AttendanceService;
	let subscriptionService: SubscriptionsService;

	const attendanceModel = {
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
				SubscriptionsService,
				AttendanceService,
				{
					provide: getModelToken(Attendance.name),
					useValue: attendanceModel,
				},
			],
		}).compile();

		attendanceService = module.get<AttendanceService>(AttendanceService);
		subscriptionService =
			module.get<SubscriptionsService>(SubscriptionsService);
	});

	it('attendanceService should be defined', () => {
		expect(attendanceService).toBeDefined();
	});
	it('attendanceModel should be defined', () => {
		expect(attendanceModel).toBeDefined();
	});
	it('subscriptionService should be defined', () => {
		expect(subscriptionService).toBeDefined();
	});

	describe('findOneByCondition', () => {
		it('should throw NotFoundException if attendance not found', async () => {
			const condition: AttendanceCondition = {};
			const populate = 'facilityID accountID';

			jest.spyOn(attendanceModel, 'findOne').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(undefined),
			}));

			await expect(
				attendanceService.findOneByCondition(condition, populate),
			).rejects.toThrow(NotFoundException);
		});
		it('should return a attendance if attendance exists', async () => {
			const condition: AttendanceCondition = {};
			const populate = 'facilityID accountID';

			jest.spyOn(attendanceModel, 'findOne').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(attendanceStub),
			}));

			const result = await attendanceService.findOneByCondition(
				condition,
				populate,
			);

			expect(attendanceModel.findOne).toHaveBeenCalledWith(condition);

			expect(result).toEqual(attendanceStub);
		});
	});

	describe('findMany', () => {
		it('should return schedule array', async () => {
			const condition: AttendanceCondition = {};
			const options: ListOptions<Attendance> = {};

			jest.spyOn(attendanceModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([attendanceStub]),
					}),
				}),
			}));

			const result = await attendanceService.findMany(condition, options);

			expect(attendanceModel.find).toHaveBeenCalledWith(condition);

			expect(result).toEqual({
				items: [attendanceStub],
				total: [attendanceStub].length,
				options,
			});
		});
	});

	describe('create', () => {
		const facilityID = AttendanceStub().facilityID._id;
		const accountID = AttendanceStub().accountID._id;
		const attendanceStub = {
			_id: '6493cd02a6a031e19d380fac',
			facilityID: AttendanceStub().facilityID,
			accountID: AttendanceStub().accountID,
			createdAt: AttendanceStub().createdAt,
			updatedAt: AttendanceStub().updatedAt,
			date: {
				push: jest.fn(),
			},
			save: jest.fn().mockReturnThis(),
		};
		const mockDate = new Date(1466424490000);
		jest.spyOn(global, 'Date').mockReturnValue(mockDate.toISOString());

		it('should throw ForbiddenException if checkActiveSubscription is false', async () => {
			jest
				.spyOn(attendanceService as any, 'checkActiveSubscription')
				.mockResolvedValue(false);

			await expect(
				attendanceService.create(facilityID, accountID),
			).rejects.toThrow(ForbiddenException);
		});
		it('should create, add date and return an attendance (there was no Attendance before)', async () => {
			jest
				.spyOn(attendanceService as any, 'checkActiveSubscription')
				.mockResolvedValue(true);

			jest.spyOn(attendanceModel, 'findOne').mockResolvedValue(undefined);

			jest.spyOn(attendanceModel, 'create').mockResolvedValue(attendanceStub);

			const result = await attendanceService.create(facilityID, accountID);

			expect(
				(attendanceService as any).checkActiveSubscription,
			).toHaveBeenCalledWith(facilityID, accountID);

			expect(attendanceModel.findOne).toHaveBeenCalledWith({
				facilityID,
				accountID,
			});

			expect(attendanceModel.create).toHaveBeenCalledWith({
				facilityID,
				accountID,
			});

			expect(attendanceStub.date.push).toHaveBeenCalledWith(new Date());

			expect(attendanceStub.save).toHaveBeenCalledTimes(1);

			expect(result).toEqual(attendanceStub);
		});
		it('should add date and return an attendance (had A before)', async () => {
			jest
				.spyOn(attendanceService as any, 'checkActiveSubscription')
				.mockResolvedValue(true);

			jest.spyOn(attendanceModel, 'findOne').mockResolvedValue(attendanceStub);

			const result = await attendanceService.create(facilityID, accountID);

			expect(
				(attendanceService as any).checkActiveSubscription,
			).toHaveBeenCalledWith(facilityID, accountID);

			expect(attendanceModel.findOne).toHaveBeenCalledWith({
				facilityID,
				accountID,
			});

			expect(attendanceStub.date.push).toHaveBeenCalledWith(new Date());

			expect(attendanceStub.save).toHaveBeenCalled();

			expect(result).toEqual(attendanceStub);
		});
	});

	describe('checkActiveSubscription', () => {
		it('should return false if subscription not found', async () => {
			const facilityID = AttendanceStub().facilityID._id;
			const accountID = AttendanceStub().accountID._id;
			const subscriptionStub: Subscription = {
				_id: '123',
				accountID,
				facilityID,
				billItemID: 'billItemID',
				packageID: 'packageID',
				expires: new Date('2024-06-22T04:24:34.315Z'),
				createdAt: new Date('2023-06-22T04:24:34.315Z'),
				updatedAt: new Date('2023-06-22T04:24:34.315Z'),
				status: SubscriptionStatus.ACTIVE,
				renew: false,
			};

			jest
				.spyOn(subscriptionService, 'findOneByCondition')
				.mockResolvedValue(subscriptionStub);

			const result = await (attendanceService as any).checkActiveSubscription(
				facilityID,
				accountID,
			);

			expect(subscriptionService.findOneByCondition).toHaveBeenCalledWith({
				accountID,
				facilityID,
				expires: { $gt: new Date() },
			});

			expect(result).toEqual(true);
		});
		it('should return true if subscription is found', async () => {
			const facilityID = AttendanceStub().facilityID._id;
			const accountID = AttendanceStub().accountID._id;

			jest
				.spyOn(subscriptionService, 'findOneByCondition')
				.mockResolvedValue(null);

			const result = await (attendanceService as any).checkActiveSubscription(
				facilityID,
				accountID,
			);

			expect(subscriptionService.findOneByCondition).toHaveBeenCalledWith({
				accountID,
				facilityID,
				expires: { $gt: new Date() },
			});

			expect(result).toEqual(false);
		});
	});

	describe('delete', () => {
		it('should throw NotFoundException if Attendance not found', async () => {
			const attendanceID = attendanceStub._id;

			jest.spyOn(attendanceModel, 'findByIdAndDelete').mockResolvedValue(null);

			await expect(attendanceService.delete(attendanceID)).rejects.toThrow(
				NotFoundException,
			);
		});
		it('should delete Attendance', async () => {
			const attendanceID = attendanceStub._id;

			jest
				.spyOn(attendanceModel, 'findByIdAndDelete')
				.mockResolvedValue(attendanceStub);

			await attendanceService.delete(attendanceID);

			expect(attendanceModel.findByIdAndDelete).toHaveBeenCalledWith(
				attendanceID,
			);
		});
	});
});
