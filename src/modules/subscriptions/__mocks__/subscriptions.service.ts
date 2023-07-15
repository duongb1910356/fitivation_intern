export const SubscriptionsService = jest.fn().mockReturnValue({
	findOneByCondition: jest.fn(),
	findMany: jest.fn(),
	findOneByID: jest.fn(),
	addDays: jest.fn(),
	checkDateAndUpdateDateIsExpired: jest.fn(),
	renew: jest.fn(),
	deleteOneByBillItemID: jest.fn(),
});
