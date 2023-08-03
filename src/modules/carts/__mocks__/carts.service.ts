import { cartItemStub } from 'src/modules/cart-items/test/stubs/cart-item.stub';
import { cartStub } from '../test/stubs/cart.stub';

export const CartsService = jest.fn().mockReturnValue({
	createOne: jest.fn().mockResolvedValue(cartStub()),
	deleteOne: jest.fn().mockResolvedValue(true),
	getCurrent: jest.fn().mockResolvedValue(cartStub()),
	addCartItemToCurrentCart: jest.fn().mockResolvedValue(true),
	removeCartItemFromCurrentCart: jest.fn().mockResolvedValue(true),
	checkDuplicateCartItemProduct: jest.fn().mockResolvedValue(true),
	updatePrice: jest.fn().mockResolvedValue(true),
	addPackagePromotionToCartItemInCurrentCart: jest.fn().mockResolvedValue(true),
	checkValidCartItemInCurrentCart: jest.fn().mockReturnValue(true),
	findOneCartItemByID: jest.fn().mockResolvedValue(cartItemStub()),
});
