import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsService } from '../cart-items.service';
import { PromotionsService } from 'src/modules/promotions/promotions.service';
import { PackageService } from 'src/modules/package/package.service';
import { getModelToken } from '@nestjs/mongoose';
import { CartItem } from '../schemas/cart-item.schema';
import { cartItemStub } from './stubs/cart-item.stub';
import { NotFoundException } from '@nestjs/common';
import { PackageStub } from 'src/modules/package/test/stubs/package.stub';

jest.mock('../../package/package.service');
jest.mock('../../promotions/promotions.service');

describe('CartItemsService', () => {
	let cartItemsService: CartItemsService;
	let packageService: PackageService;
	let promotionsService: PromotionsService;
	const cartItemModel: any = {
		findOne: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
		deleteOne: jest.fn(),
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: getModelToken(CartItem.name),
					useValue: cartItemModel,
				},
				CartItemsService,
				PackageService,
				PromotionsService,
			],
		}).compile();

		cartItemsService = moduleRef.get<CartItemsService>(CartItemsService);
		packageService = moduleRef.get<PackageService>(PackageService);
		promotionsService = moduleRef.get<PromotionsService>(PromotionsService);
	});

	it('should be defined', () => {
		expect(cartItemsService).toBeDefined();
		expect(packageService).toBeDefined();
		expect(promotionsService).toBeDefined();
	});

	describe('findOneByID', () => {
		const cartItemID = '64bcef03dfcb51ae859b6d4e';

		it('should return a cartItem', async () => {
			jest.spyOn(cartItemModel, 'findOne').mockResolvedValue(cartItemStub());

			const result = await cartItemsService.findOneByID(cartItemID);

			expect(result).toEqual(cartItemStub());

			expect(cartItemModel.findOne).toHaveBeenCalledWith({ _id: cartItemID });
		});

		it('should throw error if not found cart-item with that id', () => {
			jest.spyOn(cartItemModel, 'findOne').mockResolvedValue(undefined);

			expect(cartItemsService.findOneByID('other ID')).rejects.toEqual(
				new NotFoundException('Not found cart-item'),
			);
		});
	});
	describe('createCartItem', () => {
		const packageID = 'packageID';

		it('should return a cart-item', async () => {
			const packageStub: any = PackageStub();
			const cartItem = cartItemStub();
			cartItem.totalPrice = packageStub.price;

			jest.spyOn(packageService, 'findOneByID').mockResolvedValue(packageStub);

			jest.spyOn(cartItemModel, 'create').mockResolvedValue({
				...cartItem,
				save: jest.fn().mockResolvedValue(cartItem),
			});

			const result: any = await cartItemsService.createCartItem(packageID);

			delete result.save;

			expect(cartItemModel.create).toHaveBeenCalledWith({
				packageID: packageID,
			});

			expect(packageService.findOneByID).toHaveBeenCalledWith(packageID);

			expect(result).toEqual(cartItem);
		});
	});

	describe('deleteOne', () => {
		const cartItemID = 'cartItemID';

		it('shoudl return true', async () => {
			jest.spyOn(cartItemModel, 'findById').mockResolvedValue(cartItemStub());

			jest.spyOn(cartItemModel, 'deleteOne').mockResolvedValue(cartItemStub());

			const result = await cartItemsService.deleteOne(cartItemID);

			expect(cartItemModel.findById).toHaveBeenCalledWith(cartItemID);

			expect(cartItemModel.deleteOne).toHaveBeenCalledWith({
				_id: cartItemID,
			});

			expect(result).toEqual(true);
		});

		it('should return false', async () => {
			jest.spyOn(cartItemModel, 'findById').mockResolvedValue(undefined);

			const result = await cartItemsService.deleteOne(cartItemID);

			expect(result).toEqual(false);
		});
	});

	describe('updatePrice', () => {
		const cartItemID = 'cartItemID';
		const promotionID = null;

		describe('updatePrice a cart-item without promotion', () => {
			it('should return true', async () => {
				jest.spyOn(cartItemModel, 'findOne').mockImplementation(() => ({
					populate: jest.fn().mockResolvedValueOnce({
						...cartItemStub(),
						save: jest.fn().mockResolvedValue(cartItemStub()),
					}),
				}));

				const result = await cartItemsService.updatePrice(
					cartItemID,
					promotionID,
				);

				expect(result).toEqual(true);
			});
		});
	});
});
