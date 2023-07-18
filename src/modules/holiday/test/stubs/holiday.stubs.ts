import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { Holiday } from '../../entities/holiday.entity';

export const HolidayStub = (): Holiday => {
	return {
		_id: '6493cd02a6a031e19d380fac',
		facilityID: {
			_id: '64931e19d380fac3cd02a6a0',
			ownerID: '123123123123123123123123',
		} as unknown as Facility,
		startDate: new Date('2023-12-25T00:00:00.000Z'),
		endDate: new Date('2023-12-26T00:00:00.000Z'),
		content: 'Christmas Day',
		createdAt: new Date('2023-06-22T04:24:34.315Z'),
		updatedAt: new Date('2023-06-22T04:24:34.315Z'),
	};
};
