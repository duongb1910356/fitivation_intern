import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../payments.service';
import { BillItemsService } from 'src/modules/bill-items/bill-items.service';
import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { CartsService } from 'src/modules/carts/carts.service';
import { CartItemsService } from 'src/modules/cart-items/cart-items.service';
import { UsersService } from 'src/modules/users/users.service';
import { BillsService } from 'src/modules/bills/bills.service';
import { stripeToken } from 'nestjs-stripe';
import { userStub } from 'src/modules/users/test/stubs/user.stub';
import { cartStub } from 'src/modules/carts/test/stubs/cart.stub';
import { billStub } from 'src/modules/bills/test/stubs/bill.stub';
import { Cart } from 'src/modules/carts/schemas/cart.schema';
import { billItemStub } from 'src/modules/bill-items/test/stubs/bill-item.stub';
import { cartItemStub } from 'src/modules/cart-items/test/stubs/cart-item.stub';
import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { UserRole } from 'src/modules/users/schemas/user.schema';
import { subscriptionStub } from 'src/modules/subscriptions/test/stubs/subscription.stub';

jest.mock('../../bills/bills.service');
jest.mock('../../bill-items/bill-items.service');
jest.mock('../../subscriptions/subscriptions.service');
jest.mock('../../cart-items/cart-items.service');
jest.mock('../../users/users.service');
jest.mock('../../carts/carts.service');

describe('PaymentsService', () => {
	let paymentsService: PaymentsService;
	let billsService: BillsService;
	let billItemsService: BillItemsService;
	let subscriptionsService: SubscriptionsService;
	let cartsService: CartsService;
	let cartItemsService: CartItemsService;
	let usersService: UsersService;
	const stripeService = {
		customers: {
			search: () => {
				return {
					data: [
						{
							id: 'id',
						},
					],
				};
			},
			retrieve: () => {
				return {
					email: userStub().email,
				};
			},
		},
		paymentIntents: {
			create: () => {
				return {
					id: 'id',
					client_secret: 'client_secret',
				};
			},
			retrieve: () => {
				return {
					email: userStub().email,
					customer: 'customerID',
				};
			},
			confirm: () => {
				return {
					id: 'id',
					metadata: {
						cartItemIDs: undefined,
						subscriptionID: undefined,
					},
					description: 'description',
					then: () => {
						return {
							catch: () => {
								return null;
							},
						};
					},
				};
			},
			update: () => {
				return {};
			},
		},
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				PaymentsService,
				UsersService,
				CartsService,
				CartItemsService,
				BillsService,
				BillItemsService,
				SubscriptionsService,
				{
					provide: stripeToken,
					useValue: stripeService,
				},
			],
		}).compile();

		paymentsService = moduleRef.get<PaymentsService>(PaymentsService);
		billsService = moduleRef.get<BillsService>(BillsService);
		billItemsService = moduleRef.get<BillItemsService>(BillItemsService);
		subscriptionsService =
			moduleRef.get<SubscriptionsService>(SubscriptionsService);
		cartsService = moduleRef.get<CartsService>(CartsService);
		cartItemsService = moduleRef.get<CartItemsService>(CartItemsService);
		usersService = moduleRef.get<UsersService>(UsersService);

		jest.clearAllMocks();
	});

	it('should be defined services and dependencies', () => {
		expect(paymentsService).toBeDefined();
		expect(billsService).toBeDefined();
		expect(billItemsService).toBeDefined();
		expect(subscriptionsService).toBeDefined();
		expect(cartsService).toBeDefined();
		expect(cartItemsService).toBeDefined();
		expect(usersService).toBeDefined();
	});

	describe('purchaseSomeInCart', () => {
		const userID = '649a8f8ab185ffb672485391';
		const cartPaymentRequestDto = {
			cartItemIDs: ['64bcef03dfcb51ae859b6d4e'],
			description: 'description',
		};

		it('should return a bill', async () => {
			jest
				.spyOn(cartsService, 'getCurrent')
				.mockResolvedValue(cartStub() as unknown as Cart);
			jest
				.spyOn(cartItemsService, 'findOneByID')
				.mockResolvedValue(cartItemStub());

			jest
				.spyOn(billItemsService, 'createOne')
				.mockResolvedValue(billItemStub());
			jest
				.spyOn(subscriptionsService, 'createOne')
				.mockResolvedValue(subscriptionStub());

			jest.spyOn(billsService, 'createOne').mockResolvedValue(billStub());

			const bill = await paymentsService.purchaseSomeInCart(
				userID,
				cartPaymentRequestDto,
			);

			expect(cartsService.getCurrent).toHaveBeenCalledWith(
				userID,
				'cartItemIDs',
			);

			expect(billItemsService.createOne).toHaveBeenCalledWith(
				cartItemStub().packageID._id,
				userID,
			);

			expect(subscriptionsService.createOne).toHaveBeenCalledWith(
				userID,
				billItemStub()._id,
				billItemStub().packageID,
				billItemStub().facilityID,
			);

			expect(billsService.createOne).toHaveBeenCalledWith(
				userID,
				[billItemStub()],
				{ description: cartPaymentRequestDto.description },
			);

			expect(bill).toEqual(billStub());
		});

		it('should throw error if cart-item not found in current cart', async () => {
			jest
				.spyOn(cartsService, 'getCurrent')
				.mockResolvedValue(cartStub() as unknown as Cart);

			expect(
				paymentsService.purchaseSomeInCart(userID, {
					cartItemIDs: ['otherID'],
				}),
			).rejects.toEqual(
				new BadRequestException('Cart Item not found in current cart'),
			);

			expect(cartsService.getCurrent).toHaveBeenCalledWith(
				userID,
				'cartItemIDs',
			);
		});
	});

	describe('calcAmountListCartItem', () => {
		it('should return total price of  cart-items', async () => {
			jest
				.spyOn(cartItemsService, 'findOneByID')
				.mockResolvedValue(cartItemStub());

			const result = await paymentsService.calcAmountListCartItem([
				cartItemStub()._id,
			]);

			expect(cartItemsService.findOneByID).toHaveBeenCalledWith(
				cartItemStub()._id,
			);

			expect(result).toEqual(cartItemStub().totalPrice);
		});
	});

	describe('createSubscriptionPayment', () => {
		const userPayload = {
			sub: '649a8f8ab185ffb672485391',
			role: UserRole.MEMBER,
		};

		const subscriptionPaymentRequestDto = {
			subscriptionID: '64bcef03dfcb51ae859b6d4e',
			description: 'description',
		};

		it('should return payment response', async () => {
			jest.spyOn(usersService, 'findOneByID').mockResolvedValue(userStub());

			jest
				.spyOn(subscriptionsService, 'findOneByID')
				.mockResolvedValue(subscriptionStub());

			jest
				.spyOn(subscriptionsService, 'checkDateAndUpdateDateIsExpired')
				.mockResolvedValue({
					message: 'Subscription was expired',
					subscription: subscriptionStub(),
				});

			const paymentIntent = await paymentsService.createSubscriptionPayment(
				userPayload,
				subscriptionPaymentRequestDto,
			);

			expect(subscriptionsService.findOneByID).toHaveBeenCalledWith(
				subscriptionPaymentRequestDto.subscriptionID,
				userPayload,
				{
					path: 'packageID',
					model: 'Package',
					populate: {
						path: 'packageTypeID',
						model: 'PackageType',
						populate: {
							path: 'facilityID',
							model: 'Facility',
							select: '-reviews',
						},
					},
				},
			);

			expect(
				subscriptionsService.checkDateAndUpdateDateIsExpired,
			).toHaveBeenCalledWith(
				subscriptionPaymentRequestDto.subscriptionID,
				userPayload,
			);

			expect(paymentIntent).toEqual({
				message: 'Require confirm payment to complete',
				clientSecret: paymentIntent.clientSecret,
				paymentIntentID: paymentIntent.paymentIntentID,
			});
		});

		it('should throw error if stripe not found customer', () => {
			jest.spyOn(usersService, 'findOneByID').mockResolvedValue(userStub());

			jest.spyOn(stripeService.customers, 'search').mockReturnValueOnce({
				data: [],
			});

			expect(
				paymentsService.createSubscriptionPayment(
					userPayload,
					subscriptionPaymentRequestDto,
				),
			).rejects.toEqual(new NotFoundException('Customer not found'));
		});

		it('should throw error if subscription has not expires', () => {
			jest.spyOn(usersService, 'findOneByID').mockResolvedValue(userStub());

			jest
				.spyOn(subscriptionsService, 'findOneByID')
				.mockResolvedValue(subscriptionStub());

			jest
				.spyOn(subscriptionsService, 'checkDateAndUpdateDateIsExpired')
				.mockResolvedValue({
					message: 'Subscription has not expired',
					subscription: subscriptionStub(),
				});

			expect(
				paymentsService.createSubscriptionPayment(
					userPayload,
					subscriptionPaymentRequestDto,
				),
			).rejects.toEqual(
				new BadRequestException('Subscription has not expired'),
			);
		});

		it('should throw error if subscriptionID request not match current user', () => {
			jest.spyOn(usersService, 'findOneByID').mockResolvedValue(userStub());

			jest
				.spyOn(subscriptionsService, 'findOneByID')
				.mockResolvedValue(subscriptionStub());

			jest
				.spyOn(subscriptionsService, 'checkDateAndUpdateDateIsExpired')
				.mockResolvedValue({
					message: 'Subscription was expired',
					subscription: subscriptionStub(),
				});

			expect(
				paymentsService.createSubscriptionPayment(
					{
						sub: 'other id',
						role: UserRole.MEMBER,
					},
					subscriptionPaymentRequestDto,
				),
			).rejects.toEqual(new ForbiddenException('Forbidden resource'));
		});
	});

	describe('createCartPayment', () => {
		const userID = '649a8f8ab185ffb672485391';
		const cartPaymentRequestDto = {
			description: 'description',
			cartItemIDs: ['64bcef03dfcb51ae859b6d4e'],
		};

		it('should return payment response', async () => {
			jest.spyOn(usersService, 'findOneByID').mockResolvedValue(userStub());

			jest.spyOn(cartsService, 'getCurrent').mockResolvedValue(cartStub());

			jest
				.spyOn(paymentsService, 'calcAmountListCartItem')
				.mockResolvedValue(cartItemStub().totalPrice);

			const paymentIntent = await paymentsService.createCartPayment(
				cartPaymentRequestDto,
				userID,
			);

			expect(usersService.findOneByID).toHaveBeenCalledWith(userID);
			expect(cartsService.getCurrent).toHaveBeenCalledWith(
				userID,
				'cartItemIDs',
			);

			expect(paymentsService.calcAmountListCartItem).toHaveBeenCalledWith(
				cartPaymentRequestDto.cartItemIDs,
			);

			expect(paymentIntent).toEqual({
				message: 'Require confirm payment to complete',
				clientSecret: paymentIntent.clientSecret,
				paymentIntentID: paymentIntent.paymentIntentID,
			});
		});

		it('should throw error if stripe not found customer', () => {
			jest.spyOn(usersService, 'findOneByID').mockResolvedValue(userStub());

			jest.spyOn(stripeService.customers, 'search').mockReturnValueOnce({
				data: [],
			});

			expect(
				paymentsService.createCartPayment(cartPaymentRequestDto, userID),
			).rejects.toEqual(new NotFoundException('Customer not found'));
		});

		it('should throw error if cart-item not found in current cart', () => {
			jest.spyOn(usersService, 'findOneByID').mockResolvedValue(userStub());

			jest.spyOn(cartsService, 'getCurrent').mockResolvedValue(cartStub());

			expect(
				paymentsService.createCartPayment(
					{
						description: 'description',
						cartItemIDs: ['other id'],
					},
					userID,
				),
			).rejects.toEqual(
				new BadRequestException('Cart Item not found in current cart'),
			);
		});
	});

	// describe('confirmPayment', () => {
	// 	const mockJson = jest.fn().mockImplementation(() => null),
	// 		mockStatus = jest.fn().mockImplementation(() => ({ json: mockJson })),
	// 		mockResponse = {
	// 			status: mockStatus,
	// 		};

	// 	const userPayload = {
	// 		sub: '649a8f8ab185ffb672485391',
	// 		role: UserRole.MEMBER,
	// 	};
	// 	const paymentMethod = {
	// 		paymentMethod: 'cartID',
	// 	};
	// 	const responseObj: any = {
	// 		status: () => {
	// 			return {
	// 				json: () => {
	// 					return null;
	// 				},
	// 			};
	// 		},
	// 	};
	// 	const paymentIntentID = 'paymentIntentID';

	// 	it('should return payment response', async () => {
	// 		jest.spyOn(usersService, 'findOneByID').mockResolvedValue(userStub());

	// 		const paymentIntent = await paymentsService.confirmPayment(
	// 			paymentIntentID,
	// 			paymentMethod,
	// 			userPayload,
	// 			responseObj,
	// 		);
	// 	});
	// });
});
