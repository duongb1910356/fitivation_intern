export const BillsService = jest.fn().mockReturnValue({
	createOne: jest.fn(),
	findMany: jest.fn(),
	findOneByID: jest.fn(),
	findOne: jest.fn(),
	deleteOneByID: jest.fn(),
	updatePaymentMethod: jest.fn(),
});
