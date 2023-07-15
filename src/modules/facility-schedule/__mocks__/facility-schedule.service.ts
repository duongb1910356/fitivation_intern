import { ScheduleStub } from '../test/stubs/facility-schedule.stub';

export const PackageTypeService = jest.fn().mockReturnValue({
	findOneByCondition: jest.fn().mockResolvedValue(ScheduleStub()),
	findOneByID: jest.fn().mockResolvedValue(ScheduleStub()),
	findMany: jest.fn().mockResolvedValue([ScheduleStub()]),
	create: jest.fn().mockResolvedValue(ScheduleStub()),
	update: jest.fn().mockResolvedValue(ScheduleStub()),
	delete: jest.fn().mockResolvedValue(true),
	isOwner: jest.fn().mockResolvedValue(true),
});
