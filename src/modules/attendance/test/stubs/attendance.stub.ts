import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { Attendance } from '../../entities/attendance.entity';

export const AttendanceStub = (): Attendance => {
	return {
		_id: '6493cd02a6a031e19d380fac',
		facilityID: {
			_id: '64931e19d380fac3cd02a6a0',
			ownerID: '123123123123123123123123',
		} as unknown as Facility,
		accountID: {
			_id: '333333333333333333333333',
		} as unknown as User,
		date: [new Date('2023-06-22T04:24:34.315Z')] as Date[],
		createdAt: new Date('2023-06-22T04:24:34.315Z'),
		updatedAt: new Date('2023-06-22T04:24:34.315Z'),
	};
};
