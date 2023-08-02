import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from '../carts.service';
import { Cart } from '../schemas/cart.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CartItemsService } from 'src/modules/cart-items/cart-items.service';
import { cartStub } from './stubs/cart.stub';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { cartItemStub } from '../../cart-items/test/stubs/cart-item.stub';
import { UserRole } from 'src/modules/users/schemas/user.schema';

jest.mock('../../cart-items/cart-items.service');

describe('CartsService', () => {
	let cartsService: CartsService;
	let cartItemsService: CartItemsService;
	const cartModel: any = {
		create: jest.fn(),
		findOne: jest.fn(),
		findOneAndUpdate: jest.fn(),
		findById: jest.fn(),
		deleteOne: jest.fn(),
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: getModelToken(Cart.name),
					useValue: cartModel,
				},
				CartItemsService,
				CartsService,
			],
		}).compile();

		cartsService = moduleRef.get<CartsService>(CartsService);
		cartItemsService = moduleRef.get<CartItemsService>(CartItemsService);

		jest.clearAllMocks();
	});

	it(`should be defined it's service and dependencies`, () => {
		expect(cartsService).toBeDefined();
		expect(cartItemsService).toBeDefined();
	});

	describe('findOneCartItemByID', () => {
		const cartItemID = cartItemStub()._id;
		const user = {
			sub: 'userID',
			role: UserRole.MEMBER,
		};

		it('should return a cartItem', async () => {
			jest.spyOn(cartModel, 'findOne').mockResolvedValue(cartStub());

			jest
				.spyOn(cartItemsService, 'findOneByID')
				.mockResolvedValue(cartItemStub());

			const result = await cartsService.findOneCartItemByID(
				cartItemID,
				user,
				{},
			);

			expect(cartModel.findOne).toHaveBeenCalledWith({
				accountID: user.sub,
				cartItemIDs: cartItemID,
			});

			expect(cartItemsService.findOneByID).toHaveBeenCalledWith(cartItemID, {});

			expect(result).toEqual(cartItemStub());
		});

		it(`should throw error if not found cart-item in current user's cart`, () => {
			jest.spyOn(cartModel, 'findOne').mockResolvedValue(undefined);

			expect(
				cartsService.findOneCartItemByID(cartItemID, user, {}),
			).rejects.toEqual(
				new BadRequestException(`Not found cart-item in current user's cart`),
			);
		});
	});

	describe('createOne', () => {
		const userID = '64bd0a6fc8d5928f7897e90b';

		it('should call cartModel.create', async () => {
			jest.spyOn(cartModel, 'create').mockResolvedValueOnce(cartStub());

			await cartsService.createOne(userID);

			expect(cartModel.create).toBeCalledWith({ accountID: userID });
		});

		it('should return a cart', async () => {
			jest.spyOn(cartModel, 'create').mockResolvedValueOnce(cartStub());

			const cart = await cartsService.createOne(userID);

			expect(cart).toEqual(cartStub());
		});
	});

	describe('getCurrent', () => {
		const userID = '64bd0a6fc8d5928f7897e90b';

		it('should return a cart', async () => {
			jest.spyOn(cartModel, 'findOne').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(cartStub()),
			}));

			jest.spyOn(cartsService, 'updatePrice').mockResolvedValue(true);

			const cart = await cartsService.getCurrent(userID);

			expect(cart).toEqual(cartStub());
		});

		it('should throw error if not found cart with userID', async () => {
			jest.spyOn(cartModel, 'findOne').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValueOnce(undefined),
			}));

			jest.spyOn(cartsService, 'updatePrice').mockResolvedValue(true);

			expect(cartsService.getCurrent(userID)).rejects.toEqual(
				new NotFoundException(`Not found current user's cart`),
			);
		});
	});

	describe('deleteOne', () => {
		const userID = '64bd0a6fc8d5928f7897e90b';

		it('should return true', async () => {
			jest.spyOn(cartModel, 'findOne').mockResolvedValue(cartStub());
			jest.spyOn(cartModel, 'deleteOne').mockResolvedValue(true);

			const result = await cartsService.deleteOne(userID);

			expect(result).toEqual(true);
		});
		it('should return false if not found cart with userID', async () => {
			jest.spyOn(cartModel, 'findOne').mockResolvedValue(undefined);

			const result = await cartsService.deleteOne(userID);

			expect(result).toEqual(false);
		});
	});

	describe('addCartItemToCurrentCart', () => {
		const userID = '64bd0a6fc8d5928f7897e90b';
		const packageID = '64be66cc8c8c4ef43c3761ff';

		it('should return true', async () => {
			jest.spyOn(cartModel, 'findOne').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValueOnce({
					...cartStub(),
					save: jest.fn().mockResolvedValue(cartStub()),
				}),
			}));

			jest
				.spyOn(cartsService, 'checkDuplicateCartItemProduct')
				.mockReturnValue(false);

			jest
				.spyOn(cartItemsService, 'createCartItem')
				.mockResolvedValue(cartItemStub());

			const result = await cartsService.addCartItemToCurrentCart(
				userID,
				packageID,
			);

			expect(result).toEqual(true);
		});

		it('should throw error if duplicate product in cart', () => {
			jest.spyOn(cartModel, 'findOne').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValueOnce({
					...cartStub(),
					save: jest.fn().mockResolvedValue(cartStub()),
				}),
			}));

			jest
				.spyOn(cartsService, 'checkDuplicateCartItemProduct')
				.mockReturnValue(true);

			expect(
				cartsService.addCartItemToCurrentCart(userID, packageID),
			).rejects.toEqual(new BadRequestException('Duplicate Product in cart'));
		});

		it('should throw error if not found cart with userID', () => {
			jest.spyOn(cartModel, 'findOne').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValueOnce(undefined),
			}));

			expect(
				cartsService.addCartItemToCurrentCart(userID, packageID),
			).rejects.toEqual(new NotFoundException(`Not found current user's cart`));
		});
	});

	describe('removeCartItemFromCurrentCart', () => {
		const userID = '64bd0a6fc8d5928f7897e90b';
		const cartItemID = '64bcef03dfcb51ae859b6d4e';

		it('should return true', async () => {
			jest
				.spyOn(cartItemsService, 'findOneByID')
				.mockResolvedValue(cartItemStub());

			jest.spyOn(cartModel, 'findOneAndUpdate').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValueOnce({
					...cartStub(),
					save: jest.fn().mockResolvedValue(cartStub()),
				}),
			}));

			const result = await cartsService.removeCartItemFromCurrentCart(
				userID,
				cartItemID,
			);

			expect(result).toEqual(true);
		});

		it('should throw error if not found cartItem with cartItemID', () => {
			jest.spyOn(cartItemsService, 'findOneByID').mockResolvedValue(undefined);

			expect(
				cartsService.removeCartItemFromCurrentCart(userID, cartItemID),
			).rejects.toEqual(
				new NotFoundException(`Not found current user's cart-item`),
			);
		});

		it('should throw error if not found cart with userID', () => {
			jest
				.spyOn(cartItemsService, 'findOneByID')
				.mockResolvedValue(cartItemStub());

			jest.spyOn(cartModel, 'findOneAndUpdate').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValueOnce(undefined),
			}));

			expect(
				cartsService.removeCartItemFromCurrentCart(userID, cartItemID),
			).rejects.toEqual(new NotFoundException(`Not found current user's cart`));
		});
	});

	describe('checkDuplicateCartItemProduct', () => {
		it('should return false if not cartItems in cart', () => {
			const cartItems = [
				{
					packageID: '1',
				},
				{
					packageID: '2',
				},
			];
			const packageID = '3';

			const result = cartsService.checkDuplicateCartItemProduct(
				cartItems,
				packageID,
			);

			expect(result).toEqual(false);
		});

		it('should return true if exist cartItems in cart', () => {
			const cartItems = [
				{
					packageID: '1',
				},
				{
					packageID: '2',
				},
			];
			const packageID = '2';

			const result = cartsService.checkDuplicateCartItemProduct(
				cartItems,
				packageID,
			);

			expect(result).toEqual(true);
		});
	});

	describe('updatePrice', () => {
		const userID = '64bd0a6fc8d5928f7897e90b';

		it('should return true', async () => {
			jest.spyOn(cartModel, 'findOne').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValueOnce({
					...cartStub(),
					save: jest.fn().mockResolvedValue(cartStub()),
				}),
			}));

			jest.spyOn(cartItemsService, 'updatePrice').mockResolvedValueOnce(true);

			const result = await cartsService.updatePrice(userID);

			expect(result).toEqual(true);
		});
	});
});
