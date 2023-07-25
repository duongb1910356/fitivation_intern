import { CartItem } from 'src/modules/cart-items/schemas/cart-item.schema';

export const cartItemStub = (): CartItem => {
	return {
		_id: '64bcef03dfcb51ae859b6d4e',
		packageID: '64be66cc8c8c4ef43c3761ff',
		promotionIDs: [],
		promotionPrice: 1,
		totalPrice: 1,
		createdAt: new Date(1),
		updatedAt: new Date(1),
	};
};
