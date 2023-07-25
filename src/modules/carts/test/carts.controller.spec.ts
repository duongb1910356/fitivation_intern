import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from '../carts.controller';
import { cartStub } from './stubs/cart.stub';
import { Cart } from '../schemas/cart.schema';
import { CartsService } from '../carts.service';

jest.mock('../carts.service');

describe('CartsController', () => {
	let cartsController: CartsController;
	let cartsService: CartsService;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			controllers: [CartsController],
			providers: [CartsService],
		}).compile();

		cartsController = moduleRef.get<CartsController>(CartsController);
		cartsService = moduleRef.get<CartsService>(CartsService);

		jest.clearAllMocks();
	});

	it('should be defined controller and service', () => {
		expect(cartsController).toBeDefined();
		expect(cartsService).toBeDefined();
	});

	describe('getCurrentUserCart', () => {
		describe('when getCurrentUserCart is called', () => {
			let cart: Cart;

			beforeEach(async () => {
				cart = await cartsController.getCurrentUserCart(cartStub().accountID);
			});

			it('should call cartService.getCurrent', async () => {
				const populateOpt = {
					path: 'cartItemIDs',
					model: 'CartItem',
					populate: {
						path: 'packageID',
						model: 'Package',
						select: '-facilityID',
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
				};

				expect(cartsService.getCurrent).toBeCalledWith(
					cartStub().accountID,
					populateOpt,
				);
			});

			it('should return a cart', async () => {
				expect(cart).toEqual(cartStub());
			});
		});
	});

	describe('addCartItemToCurrentCart', () => {
		let result: boolean;
		const packageID = '64be66cc8c8c4ef43c3761ff';

		describe('when addCartItemToCurrentCart is called', () => {
			beforeEach(async () => {
				result = await cartsController.addCartItemToCurrentCart(
					cartStub().accountID,
					packageID,
				);
			});

			it('should call cartsService.addCartItemToCurrentCart', () => {
				expect(cartsService.addCartItemToCurrentCart).toBeCalledWith(
					cartStub().accountID,
					packageID,
				);
			});

			it('should return true', () => {
				expect(result).toEqual(true);
			});
		});
	});

	describe('removeCartItemToCurrentCart', () => {
		let result: boolean;
		const cartItemID = '64be66cc8c8c4ef43c3761ff';

		describe('when removeCartItemToCurrentCart is called', () => {
			beforeEach(async () => {
				result = await cartsController.removeCartItemToCurrentCart(
					cartStub().accountID,
					cartItemID,
				);
			});

			it('should call cartsService.removeCartItemToCurrentCart', () => {
				expect(cartsService.removeCartItemFromCurrentCart).toBeCalledWith(
					cartStub().accountID,
					cartItemID,
				);
			});

			it('should return true', () => {
				expect(result).toEqual(true);
			});
		});
	});
});
