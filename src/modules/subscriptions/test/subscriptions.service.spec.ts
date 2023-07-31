import { PackageService } from 'src/modules/package/package.service';
import { Subscription } from '../schemas/subscription.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SubscriptionsService } from '../subscriptions.service';
import { Model } from 'mongoose';
import { UserRole } from 'src/modules/users/schemas/user.schema';
import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { subscriptionStub } from './stubs/subscriptions.stub';
import { QueryAPI, QueryObject } from 'src/shared/utils/query-api';

jest.mock('../../package/package.service');
jest.mock('../../../shared/utils/query-api');
describe('SubscriptionsService', function () {
	let packageService: PackageService;
	let subscriptionService: SubscriptionsService;
	let subscriptionsModel: Model<Subscription>;

	const mockModel: any = {
		create: jest.fn(),
		find: jest.fn(() => {
			return {
				sort: () => {
					return {
						select: () => {
							return {
								skip: () => {
									return {
										limit: () => {
											return jest.fn();
										},
									};
								},
							};
						},
					};
				},
			};
		}),
		findById: jest.fn(),
		findOneAndDelete: jest.fn(),
		aggregate: jest.fn(),
		findOne: jest.fn(),
		filter: jest.fn(),
		sort: jest.fn(),
		limitfields: jest.fn(),
		paginate: jest.fn(),
	};
	const query: QueryObject = {};

	const mockUser = {
		sub: '649a8f8ab185ffb672485391',
		role: UserRole.MEMBER,
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SubscriptionsService,
				PackageService,
				{
					provide: getModelToken(Subscription.name),
					useValue: mockModel,
				},
			],
		}).compile();

		subscriptionService =
			module.get<SubscriptionsService>(SubscriptionsService);
		packageService = module.get<PackageService>(PackageService);
		subscriptionsModel = module.get<Model<Subscription>>(
			getModelToken(Subscription.name),
		);
		jest.clearAllMocks();
	});

	// afterEach(() => {
	// });

	it('should be defined', () => {
		expect(subscriptionService).toBeDefined();
	});

	it('subscriptionModel should be defined', () => {
		expect(subscriptionsModel).toBeDefined();
	});

	describe('addDays', () => {
		it('should correctly add days to the date', () => {
			const currentDate = new Date('2023-07-19');
			const daysToAdd = 5;
			const expectedDate = new Date('2023-07-24');
			const result = subscriptionService.addDays(currentDate, daysToAdd);
			expect(result).toEqual(expectedDate);
		});

		it('should handle adding days to the end of the month', () => {
			const currentDate = new Date('2023-07-27');
			const daysToAdd = 5;
			const expectedDate = new Date('2023-08-01');
			const result = subscriptionService.addDays(currentDate, daysToAdd);
			expect(result).toEqual(expectedDate);
		});

		it('should handle adding days to the end of the year', () => {
			const currentDate = new Date('2023-12-28');
			const daysToAdd = 5;
			const expectedDate = new Date('2024-01-02');
			const result = subscriptionService.addDays(currentDate, daysToAdd);
			expect(result).toEqual(expectedDate);
		});

		it('should correctly handle negative days', () => {
			const currentDate = new Date('2023-07-19');
			const daysToAdd = -3;
			const expectedDate = new Date('2023-07-16');

			const result = subscriptionService.addDays(currentDate, daysToAdd);

			expect(result).toEqual(expectedDate);
		});
	});

	describe('checkDateAndUpdateDateIsExpired', () => {
		it('should throw BadRequestException if subscription is not found', async () => {
			jest.spyOn(mockModel, 'findById').mockResolvedValueOnce(null);

			await expect(
				subscriptionService.checkDateAndUpdateDateIsExpired(
					'6497c6807a114f5b35a393fd',
					mockUser,
				),
			).rejects.toThrow(BadRequestException);
		});

		it('should throw ForbiddenException if user is not ADMIN and not the owner of the subscription', async () => {
			const mockInvalidUser = { ...mockUser, sub: 'different_user_id' };

			jest
				.spyOn(mockModel, 'findById')
				.mockResolvedValueOnce(subscriptionStub());

			await expect(
				subscriptionService.checkDateAndUpdateDateIsExpired(
					'subscription_id_123',
					mockInvalidUser,
				),
			).rejects.toThrow(ForbiddenException);
		});

		it('should set renew to true and return correct message if subscription has expired', async () => {
			const mockExpiredSubscription = {
				_id: '64b5fb7409c136b1b2789db6',
				accountID: '649a8f8ab185ffb672485391',
				billItemID: '64b5fb7409c136b1b2789dc6',
				packageID: '649dd2e7e895344f72e91c42',
				facilityID: '649d344f72e91c40d2e7e895',
				expires: new Date('2023-06-18T08:50:57.500Z'),
				status: 'ACTIVE',
				renew: false,
				createdAt: new Date('2023-07-18T02:39:48.020Z'),
				updatedAt: new Date('2023-07-19T08:50:57.501Z'),
			};
			const mockSpyExpiredSubscription = {
				...mockExpiredSubscription,
				save: jest.fn().mockResolvedValue(mockExpiredSubscription),
			};
			jest
				.spyOn(mockModel, 'findById')
				.mockResolvedValueOnce(mockSpyExpiredSubscription);

			const result = await subscriptionService.checkDateAndUpdateDateIsExpired(
				'64b5fb7409c136b1b2789db6',
				mockUser,
			);
			expect(result.message).toEqual('Subscription was expired');
			expect(result.subscription.renew).toEqual(true);
			expect(mockSpyExpiredSubscription.save).toHaveBeenCalledTimes(1);
		});

		it('should set renew to false and return correct message if subscription has not expired', async () => {
			const mockExpiredSubscription = {
				_id: '64b5fb7409c136b1b2789db6',
				accountID: '649a8f8ab185ffb672485391',
				billItemID: '64b5fb7409c136b1b2789dc6',
				packageID: '649dd2e7e895344f72e91c42',
				facilityID: '649d344f72e91c40d2e7e895',
				expires: new Date('2024-06-18T08:50:57.500Z'),
				status: 'ACTIVE',
				renew: false,
				createdAt: new Date('2023-07-18T02:39:48.020Z'),
				updatedAt: new Date('2023-07-19T08:50:57.501Z'),
			};
			const mockSpyExpiredSubscription = {
				...mockExpiredSubscription,
				save: jest.fn().mockResolvedValue(mockExpiredSubscription),
			};
			jest
				.spyOn(mockModel, 'findById')
				.mockResolvedValueOnce(mockSpyExpiredSubscription);

			const result = await subscriptionService.checkDateAndUpdateDateIsExpired(
				'64b5fb7409c136b1b2789db6',
				mockUser,
			);
			expect(result.message).toEqual('Subscription has not expired');
			expect(result.subscription.renew).toEqual(false);
			expect(mockSpyExpiredSubscription.save).toHaveBeenCalledTimes(1);
		});
	});

	describe('checkActive', () => {
		it('should return true if subscription exists and not expired', async () => {
			const mockDate = new Date('2023-07-25T00:00:00.000Z');
			jest
				.spyOn(global, 'Date')
				.mockImplementation(() => mockDate as unknown as string);

			jest.spyOn(mockModel, 'findOne').mockResolvedValue(subscriptionStub());

			const isActive = await subscriptionService.checkActive(
				'your-facility-id',
				'your-account-id',
			);
			expect(mockModel.findOne).toHaveBeenCalledWith({
				accountID: 'your-account-id',
				facilityID: 'your-facility-id',
				expires: { $gt: mockDate },
			});
			expect(isActive).toBe(true);
		});

		it('should return false if subscription does not exist', async () => {
			jest.spyOn(mockModel, 'findOne').mockResolvedValue(null);
			const isActive = await subscriptionService.checkActive(
				'your-facility-id',
				'your-account-id',
			);
			expect(isActive).toBe(false);
		});
	});

	describe('findOneByCondition', () => {
		it('should return subscription if found based on condition', async () => {
			const condition = { accountID: 'your-account-id' };

			jest.spyOn(mockModel, 'findOne').mockResolvedValue(subscriptionStub());

			const result = await subscriptionService.findOneByCondition(condition);
			expect(result).toEqual(subscriptionStub());
		});

		it('should throw NotFoundException if subscription not found based on condition', async () => {
			const condition = { accountID: 'non-existing-account-id' };

			jest.spyOn(mockModel, 'findOne').mockResolvedValue(null);

			await expect(
				subscriptionService.findOneByCondition(condition),
			).rejects.toThrowError(NotFoundException);
		});
	});

	describe('findMany', () => {
		it('should return subscriptions based on the query and user.role is MEMBER', async () => {
			const user = { role: UserRole.MEMBER, sub: 'your-account-id' };
			const mockSubsciptionModel = {
				sort: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnValueOnce([subscriptionStub()]),
			};

			jest
				.spyOn(mockModel, 'find')
				.mockImplementationOnce(() => mockSubsciptionModel);

			const result = await subscriptionService.findMany(query, user);

			expect(result.items).toEqual([subscriptionStub()]);
		});
	});
});
