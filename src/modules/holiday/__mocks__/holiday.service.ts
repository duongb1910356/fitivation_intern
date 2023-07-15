import { HolidayStub } from '../test/stubs/holiday.stubs';

export const PackageTypeService = jest.fn().mockReturnValue({
	findOneByID: jest.fn().mockResolvedValue(HolidayStub()),
	findMany: jest.fn().mockResolvedValue([HolidayStub()]),
	create: jest.fn().mockResolvedValue(HolidayStub()),
	update: jest.fn().mockResolvedValue(HolidayStub()),
	delete: jest.fn().mockResolvedValue(true),
	isOwner: jest.fn().mockResolvedValue(true),
	checkOverlapAndTransform: jest.fn(),
});
