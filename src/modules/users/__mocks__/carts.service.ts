import { cartStub } from 'src/modules/carts/test/stubs/cart.stub';

export const CartsService = jest.fn().mockReturnValue({
	createOne: jest.fn().mockResolvedValue(cartStub()),
	deleteOne: jest.fn().mockResolvedValue(true),
});
