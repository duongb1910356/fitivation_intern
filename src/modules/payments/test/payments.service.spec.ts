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
import { SubscriptionStatus } from 'src/modules/subscriptions/schemas/subscription.schema';

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

	const userPayload = {
		sub: '649a8f8ab185ffb672485391',
		role: UserRole.MEMBER,
	};
	const paymentIntentID = 'paymentIntentID';
	const clientSecretID = 'clientSecretID';

	const stripeService: any = {
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
					customer: 'customerID',
				};
			},
		},
		paymentIntents: {
			create: () => {
				return {
					id: paymentIntentID,
					client_secret: clientSecretID,
				};
			},
			retrieve: () => {
				return {
					id: paymentIntentID,
					email: userStub().email,
					customer: 'customerID',
					cartItemIDs: undefined,
					subscriptionID: undefined,
				};
			},
			update: () => {
				return {};
			},
			confirm: () => {
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

	describe('confirmPayment', () => {
		const paymentMethod = {
			paymentMethod: 'cartID',
		};

		const cartItemIDs = 'cartItemID';
		const subscriptionID = 'subscriptionID';
		const subscriptionStub: any = {
			_id: '64b5fb7409c136b1b2789db6',
			accountID: '649a8f8ab185ffb672485391',
			billItemID: '64b5fb7409c136b1b2789dc6',
			packageID: {
				_id: '649dd2e7e895344f72e91c42',
			},
			facilityID: '649d344f72e91c40d2e7e895',
			expires: new Date('2023-08-18T08:50:57.500Z'),
			status: SubscriptionStatus.ACTIVE,
			renew: false,
			createdAt: new Date('2023-07-18T02:39:48.020Z'),
			updatedAt: new Date('2023-07-19T08:50:57.501Z'),
		};

		it('should return payment response in cart payment', async () => {
			jest.spyOn(usersService, 'findOneByID').mockResolvedValueOnce(userStub());

			jest
				.spyOn(stripeService.paymentIntents, 'retrieve')
				.mockResolvedValueOnce({
					id: paymentIntentID,
					client_secret: clientSecretID,
					email: userStub().email,
					customer: userPayload.sub,
					metadata: {
						cartItemIDs: cartItemIDs,
					},
				});

			jest
				.spyOn(paymentsService, 'purchaseSomeInCart')
				.mockResolvedValue(billStub());

			jest.spyOn(billsService, 'findOneByID').mockResolvedValueOnce(billStub());

			const paymentIntent: any = await paymentsService.confirmPayment(
				paymentIntentID,
				paymentMethod,
				userPayload,
			);

			expect(stripeService.paymentIntents.retrieve).toHaveBeenCalledWith(
				paymentIntentID,
			);

			expect(usersService.findOneByID).toHaveBeenCalledWith(userPayload.sub);

			expect(paymentsService.purchaseSomeInCart).toHaveBeenCalledWith(
				userPayload.sub,
				{
					cartItemIDs: [cartItemIDs],
				},
			);

			expect(billsService.updatePaymentMethod).toHaveBeenCalledWith(
				billStub()._id,
				paymentMethod,
			);

			expect(cartsService.removeCartItemFromCurrentCart).toHaveBeenCalledWith(
				userPayload.sub,
				cartItemIDs,
			);

			expect(billsService.findOneByID).toHaveBeenCalledWith(
				billStub()._id,
				userPayload,
			);

			expect(paymentIntent).toEqual({
				message: 'Payment successful',
				clientSecret: clientSecretID,
				paymentIntentID: paymentIntentID,
				bill: billStub(),
			});
		});

		it('should return payment response in subscription payment', async () => {
			jest
				.spyOn(stripeService.paymentIntents, 'retrieve')
				.mockResolvedValueOnce({
					id: paymentIntentID,
					client_secret: clientSecretID,
					email: userStub().email,
					customer: userPayload.sub,
					metadata: {
						subscriptionID: subscriptionID,
					},
				});

			jest
				.spyOn(subscriptionsService, 'findOneByID')
				.mockResolvedValueOnce(subscriptionStub);

			jest
				.spyOn(billItemsService, 'createOne')
				.mockResolvedValueOnce(billItemStub());

			jest.spyOn(billsService, 'createOne').mockResolvedValueOnce(billStub());

			jest.spyOn(billsService, 'findOneByID').mockResolvedValueOnce(billStub());

			const paymentIntent: any = await paymentsService.confirmPayment(
				paymentIntentID,
				paymentMethod,
				userPayload,
			);

			expect(stripeService.paymentIntents.retrieve).toHaveBeenCalledWith(
				paymentIntentID,
			);

			expect(usersService.findOneByID).toHaveBeenCalledWith(userPayload.sub);

			expect(billItemsService.createOne).toHaveBeenCalledWith(
				subscriptionStub.packageID._id,
				userPayload.sub,
			);

			expect(billsService.updatePaymentMethod).toHaveBeenCalledWith(
				billStub()._id,
				paymentMethod,
			);

			expect(subscriptionsService.renew).toHaveBeenCalledWith(
				subscriptionID,
				billItemStub()._id,
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

			expect(paymentIntent).toEqual({
				message: 'Payment successful',
				clientSecret: clientSecretID,
				paymentIntentID: paymentIntentID,
				bill: billStub(),
			});
		});

		it('should throw forbidden exception when user send payment not belong to', () => {
			jest.spyOn(stripeService.customers, 'retrieve').mockResolvedValueOnce({
				email: 'other email',
				customer: 'other ID',
			});

			jest.spyOn(usersService, 'findOneByID').mockResolvedValueOnce(userStub());

			expect(
				paymentsService.confirmPayment(
					paymentIntentID,
					paymentMethod,
					userPayload,
				),
			).rejects.toEqual(
				new ForbiddenException('This payment does not belong to current user'),
			);
		});
	});
});
