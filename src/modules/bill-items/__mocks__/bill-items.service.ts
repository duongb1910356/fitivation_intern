export const BillItemsService = jest.fn().mockReturnValue({
	findOneByCondition: jest.fn(),
	findOneByID: jest.fn(),
	createOne: jest.fn(),
	deleteOneByID: jest.fn(),
});
