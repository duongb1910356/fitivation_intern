export const PromotionsService = jest.fn().mockReturnValue({
	findOneByID: jest.fn(),
	findMany: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
});
