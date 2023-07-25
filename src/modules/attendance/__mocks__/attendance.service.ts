import { AttendanceStub } from '../test/stubs/attendance.stub';

export const AttendanceService = jest.fn().mockReturnValue({
	findOneByCondition: jest.fn().mockResolvedValue(AttendanceStub()),
	findMany: jest.fn().mockResolvedValue([AttendanceStub()]),
	create: jest.fn().mockResolvedValue(AttendanceStub()),
	checkActiveSubscription: jest.fn().mockResolvedValue(true),
	delete: jest.fn().mockResolvedValue(true),
});
