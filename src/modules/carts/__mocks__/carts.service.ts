import { cartStub } from '../test/stubs/cart.stub';

export const CartsService = jest.fn().mockReturnValue({
	getCurrent: jest.fn().mockResolvedValue(cartStub()),
	addCartItemToCurrentCart: jest.fn().mockResolvedValue(true),
	removeCartItemFromCurrentCart: jest.fn().mockResolvedValue(true),
});
