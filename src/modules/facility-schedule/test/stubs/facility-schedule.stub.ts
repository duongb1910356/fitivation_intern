import { Facility } from 'src/modules/facility/schemas/facility.schema';
import {
	FacilitySchedule,
	ScheduleType,
} from '../../entities/facility-schedule.entity';
import { dayOfWeek } from '../../entities/open-time.entity';

export const ScheduleStub = (): FacilitySchedule => {
	return {
		_id: '6493cd02a6a031e19d380fac',
		facilityID: {
			_id: '64931e19d380fac3cd02a6a0',
			ownerID: '123123123123123123123123',
		} as unknown as Facility,
		type: ScheduleType.WEEKLY,
		openTime: [
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '10:00',
					},
					{
						startTime: '13:00',
						endTime: '18:00',
					},
				],
				dayOfWeek: dayOfWeek.MONDAY,
			},
			{
				shift: [
					{
						startTime: '06:00',
						endTime: '10:00',
					},
					{
						startTime: '13:00',
						endTime: '18:00',
					},
				],
				dayOfWeek: dayOfWeek.TUESDAY,
			},
		],
		createdAt: new Date('2023-06-22T04:24:34.315Z'),
		updatedAt: new Date('2023-06-22T04:24:34.315Z'),
	};
};
