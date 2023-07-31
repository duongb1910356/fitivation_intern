import { Test, TestingModule } from '@nestjs/testing';
import { BillsService } from '../bills.service';
import { BillItemsService } from 'src/modules/bill-items/bill-items.service';
import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Bill } from '../schemas/bill.schema';
import { billItemStub } from 'src/modules/bill-items/test/stubs/bill-item.stub';
import { billStub } from './stubs/bill.stub';
import { UserRole } from 'src/modules/users/schemas/user.schema';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

jest.mock('../../bill-items/bill-items.service');
jest.mock('../../subscriptions/subscriptions.service');

describe('BillsService', () => {
	let billsService: BillsService;
	const billModel: any = {
		create: jest.fn(),
		findById: jest.fn(),
		findOne: jest.fn(),
		deleteOne: jest.fn(),
		findByIdAndUpdate: jest.fn(),
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
	};
	let billItemsService: BillItemsService;
	let subscriptionService: SubscriptionsService;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: getModelToken(Bill.name),
					useValue: billModel,
				},
				BillsService,
				BillItemsService,
				SubscriptionsService,
			],
		}).compile();

		billsService = moduleRef.get<BillsService>(BillsService);
		billItemsService = moduleRef.get<BillItemsService>(BillItemsService);
		subscriptionService =
			moduleRef.get<SubscriptionsService>(SubscriptionsService);
	});

	it(`should be defined it's service and dependencies`, () => {
		expect(billsService).toBeDefined();
		expect(billItemsService).toBeDefined();
		expect(subscriptionService).toBeDefined();
	});

	describe('createOne', () => {
		const userID = '';
		const billItems = [billItemStub()];
		const optData = { description: 'Cart payment' };

		it('should return a bill', async () => {
			jest.spyOn(billModel, 'create').mockResolvedValue(billStub());

			const result = await billsService.createOne(userID, billItems, optData);

			expect(billModel.create).toHaveBeenCalledWith({
				accountID: userID,
				billItems: billItems,
				// taxes: PaymentRequestDto.taxes || 0,
				PaymentMethod: null,
				description: optData?.description,
				promotions: [],
				promotionPrice: 0,
				totalPrice: billStub().totalPrice,
			});

			expect(result).toEqual(billStub());
		});
	});

	describe('findMany', () => {
		const query = {};
		const userPayload = {
			sub: '649a8f8ab185ffb672485391',
			role: UserRole.ADMIN,
		};

		it('should return list bills', async () => {
			const mockBillModel = {
				sort: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnValue([billStub()]),
			};

			jest.spyOn(billModel, 'find').mockImplementationOnce(() => mockBillModel);

			const result = await billsService.findMany(query, userPayload);

			expect(result).toEqual({
				total: result.total,
				queryOptions: result.queryOptions,
				items: result.items,
			});
		});
	});

	describe('findOneByID', () => {
		const billID = '64b5fb7409c136b1b2789dd3';
		const userPayload = {
			sub: '649a8f8ab185ffb672485391',
			role: UserRole.ADMIN,
		};

		it('should return a bill', async () => {
			jest.spyOn(billModel, 'findById').mockResolvedValue(billStub());

			const result = await billsService.findOneByID(billID, userPayload);

			expect(billModel.findById).toHaveBeenCalledWith(billID);

			expect(result).toEqual(billStub());
		});

		it('should throw not found exception if not found bill with billID', () => {
			jest.spyOn(billModel, 'findById').mockResolvedValue(undefined);

			expect(
				billsService.findOneByID(billID, {
					sub: 'otherID',
					role: UserRole.MEMBER,
				}),
			).rejects.toEqual(new NotFoundException('Bill not found'));
		});

		it('should throw forbidden exception if customer find bill of other', () => {
			jest.spyOn(billModel, 'findById').mockResolvedValue(billStub());

			expect(
				billsService.findOneByID(billID, {
					sub: 'otherID',
					role: UserRole.MEMBER,
				}),
			).rejects.toEqual(new ForbiddenException('Forbidden resource'));
		});
	});

	describe('findOne', () => {
		const condition = { _id: billStub()._id };

		it('should return a bill', async () => {
			jest.spyOn(billModel, 'findOne').mockResolvedValue(billStub());

			const result = await billsService.findOne(condition);

			expect(result).toEqual(billStub());
		});

		it('should throw not found exception if not found with condition', () => {
			jest.spyOn(billModel, 'findOne').mockResolvedValue(undefined);

			expect(billsService.findOne(condition)).rejects.toEqual(
				new NotFoundException('Bill not found'),
			);
		});
	});

	describe('deleteOneByID', () => {
		const billID = '64b5fb7409c136b1b2789dd3';
		it('should return true', async () => {
			jest.spyOn(billModel, 'findById').mockResolvedValue(billStub());

			const result = await billsService.deleteOneByID(billID);

			expect(billModel.findById).toHaveBeenCalledWith(billID);

			expect(result).toEqual(true);
		});

		it('should return false', async () => {
			jest.spyOn(billModel, 'findById').mockResolvedValue(undefined);

			const result = await billsService.deleteOneByID(billID);

			expect(result).toEqual(false);
		});
	});

	describe('updatePaymentMethod', () => {
		const billID = '64b5fb7409c136b1b2789dd3';
		const paymentMethod = {
			paymentMethod: 'payment_method',
		};

		it('should return true', async () => {
			jest.spyOn(billModel, 'findByIdAndUpdate').mockResolvedValue(billStub());

			const result = await billsService.updatePaymentMethod(
				billID,
				paymentMethod,
			);

			expect(result).toEqual(true);
		});

		it('should return false', async () => {
			jest.spyOn(billModel, 'findByIdAndUpdate').mockResolvedValue(undefined);

			const result = await billsService.updatePaymentMethod(
				billID,
				paymentMethod,
			);

			expect(result).toEqual(false);
		});
	});
});
