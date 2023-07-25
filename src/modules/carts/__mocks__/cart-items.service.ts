import { cartItemStub } from '../test/stubs/cart-item.stub';

export const CartItemsService = jest.fn().mockReturnValue({
	findOneByID: jest.fn().mockResolvedValue(cartItemStub()),
	createCartItem: jest.fn().mockResolvedValue(cartItemStub()),
	deleteOne: jest.fn().mockResolvedValue(true),
	updatePrice: jest.fn().mockResolvedValue(true),
	addPackagePromotionToCartItem: jest.fn().mockResolvedValue(true),
});
